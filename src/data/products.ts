import { supabase } from '@/integrations/supabase/client';

export interface ProductSpecifications {
  id?: string;
  min_order_quantity?: number;
  usage_application?: string;
  brand?: string;
  beam_angle?: string;
  power?: string;
  ip_rating?: string;
  body_material?: string;
  lighting_type?: string;
  input_voltage?: string;
  frequency?: string;
  item_weight?: string;
  phase?: string;
  pcb_area_size?: string;
  driver_area_size?: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  wattage: number;
  shape: 'Round' | 'Square' | 'Rectangular' | 'Custom';
  material: string;
  color: string;
  is_active: boolean;
  specifications_id?: string;
  specifications?: ProductSpecifications;
  images?: string[];
  price?: string;
  image_url?: string;
  model_url?: string;
}

// Mock data for initial loading - will be replaced with DB data
export const productsMock: Product[] = [
  {
    id: '1',
    name: '5W Round Housing',
    description: 'Premium 5W round LED housing with aluminum finish.',
    wattage: 5,
    shape: 'Round',
    material: 'Aluminum',
    color: 'Silver',
    is_active: true,
    images: ['/placeholder.svg'],
    price: '₹150'
  },
  {
    id: '2',
    name: '10W Square Housing',
    description: 'Durable 10W square LED housing for commercial applications.',
    wattage: 10,
    shape: 'Square',
    material: 'Plastic',
    color: 'White',
    is_active: true,
    images: ['/placeholder.svg'],
    price: '₹250'
  },
  {
    id: '3',
    name: '24W Street Light Housing',
    description: 'Heavy-duty 24W LED housing for outdoor street lighting.',
    wattage: 24,
    shape: 'Rectangular',
    material: 'Aluminum',
    color: 'Black',
    is_active: true,
    images: ['/placeholder.svg'],
    price: '₹400'
  }
];

// Mock inquiries data
export const inquiriesMock = [
  {
    id: '1',
    productName: '5W Round Housing',
    quantity: 100,
    phone: '+919876543210',
    date: '2023-05-01',
    status: 'New'
  },
  {
    id: '2',
    productName: '10W Square Housing',
    quantity: 50,
    phone: '+919876543211',
    date: '2023-05-02',
    status: 'Called'
  },
  {
    id: '3',
    productName: '24W Street Light Housing',
    quantity: 25,
    phone: '+919876543212',
    date: '2023-05-03',
    status: 'Ignored'
  }
];

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_specifications(*),
      product_images(image_url)
    `);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(product => ({
    ...product,
    shape: mapShapeValue(product.shape),
    images: product.product_images?.map(img => img.image_url) || [],
    specifications: product.product_specifications
  }));
}

// Helper function to ensure shape values match our union type
function mapShapeValue(shape: string): 'Round' | 'Square' | 'Rectangular' | 'Custom' {
  switch (shape) {
    case 'Round':
      return 'Round';
    case 'Square':
      return 'Square';
    case 'Rectangular':
      return 'Rectangular';
    default:
      return 'Custom';
  }
}

// Function to ensure storage bucket exists
export async function ensureStorageBucketExists() {
  try {
    // First check if the storage extension is enabled
    const { data: extensionData, error: extensionError } = await supabase.rpc('get_available_extensions');
    
    if (extensionError) {
      console.error('Error checking extensions:', extensionError);
    }
    
    // Check if the bucket exists
    const { data, error } = await supabase.storage.getBucket('products');
    
    if (error) {
      if (error.message.includes('not found')) {
        console.log('Bucket not found, attempting to create...');
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket('products', {
          public: true, // Make it public so we can access images without authentication
          fileSizeLimit: 10485760, // 10MB limit
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'model/gltf-binary']
        });
        
        if (createError) {
          console.error('Error creating storage bucket:', createError);
          return false;
        }
        
        console.log('Storage bucket "products" created successfully');
        return true;
      } else {
        console.error('Error checking storage bucket:', error);
        return false;
      }
    }
    
    console.log('Storage bucket "products" already exists');
    return true;
  } catch (error) {
    console.error('Error ensuring storage bucket exists:', error);
    return false;
  }
}

export async function addProduct(product: Product): Promise<Product | null> {
  try {
    // Ensure the storage bucket exists
    await ensureStorageBucketExists();
    
    // Handle 3D model file if present - but this is now handled directly in the form
    let modelUrl = product.model_url;
    
    // First, insert specifications
    const { data: specData, error: specError } = await supabase
      .from('product_specifications')
      .insert(product.specifications || {})
      .select()
      .single();

    if (specError) throw specError;

    // Then, insert product with specifications ID
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        wattage: product.wattage,
        shape: product.shape,
        material: product.material,
        color: product.color,
        is_active: product.is_active,
        specifications_id: specData.id,
        image_url: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg',
        price: product.price || '',
        model_url: modelUrl
      })
      .select()
      .single();

    if (productError) throw productError;

    // Handle product images - they should already be uploaded to storage at this point,
    // we just need to save their URLs to the database
    if (product.images && product.images.length > 0) {
      const imageInserts = (product.images as string[]).map((imageUrl: string, index: number) => ({
        product_id: productData.id,
        image_url: imageUrl,
        display_order: index
      }));

      await supabase.from('product_images').insert(imageInserts);
    }

    return {
      ...productData,
      shape: mapShapeValue(productData.shape),
      images: product.images,
      specifications: product.specifications
    };
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}

export async function updateProduct(product: Product): Promise<Product | null> {
  try {
    // Update specifications first if they exist
    if (product.specifications && product.specifications_id) {
      await supabase
        .from('product_specifications')
        .update(product.specifications)
        .eq('id', product.specifications_id);
    }

    // Update product details
    const { data: productData, error: productError } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        wattage: product.wattage,
        shape: product.shape,
        material: product.material,
        color: product.color,
        is_active: product.is_active,
        image_url: product.images && product.images.length > 0 ? product.images[0] : product.image_url || '/placeholder.svg',
        price: product.price || '',
        model_url: product.model_url || null
      })
      .eq('id', product.id)
      .select()
      .single();

    if (productError) throw productError;

    // Update images if any
    if (product.images && product.images.length > 0) {
      // First, delete existing images
      await supabase.from('product_images').delete().eq('product_id', product.id);

      // Then insert new images with explicit typing
      const imageInserts = (product.images as string[]).map((imageUrl: string, index: number) => ({
        product_id: product.id,
        image_url: imageUrl,
        display_order: index
      }));

      await supabase.from('product_images').insert(imageInserts);
    }

    return {
      ...productData,
      shape: mapShapeValue(productData.shape),
      images: product.images,
      specifications: product.specifications
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function toggleProductStatus(productId: string, isActive: boolean): Promise<void> {
  await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId);
}

export async function fetchInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select(`
      *,
      products(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }

  return data.map(inquiry => ({
    id: inquiry.id,
    productName: inquiry.products?.name || 'Unknown Product',
    quantity: inquiry.quantity,
    phone: inquiry.phone,
    date: new Date(inquiry.created_at).toLocaleDateString(),
    status: inquiry.status
  }));
}

export async function saveInquiry(productId: string, quantity: number, phone: string) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      product_id: productId,
      quantity,
      phone,
      status: 'New'
    })
    .select();

  if (error) {
    console.error('Error saving inquiry:', error);
    return null;
  }

  return data[0];
}

export async function updateInquiryStatus(inquiryId: string, status: string) {
  const { error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', inquiryId);

  if (error) {
    console.error('Error updating inquiry status:', error);
    return false;
  }

  return true;
}
