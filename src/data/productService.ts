
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { ensureStorageBucketExists } from './storage';

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
      const imageInserts = product.images.map((imageUrl, index) => ({
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

      // Then insert new images
      const imageInserts = product.images.map((imageUrl, index) => ({
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
