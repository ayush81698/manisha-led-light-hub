
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
    images: product.product_images?.map(img => img.image_url) || [],
    specifications: product.product_specifications
  }));
}

export async function addProduct(product: Product): Promise<Product | null> {
  try {
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
        specifications_id: specData.id
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert images if any
    if (product.images && product.images.length > 0) {
      const imageInserts = product.images.map((imageUrl, index) => ({
        product_id: productData.id,
        image_url: imageUrl,
        display_order: index
      }));

      await supabase.from('product_images').insert(imageInserts);
    }

    return productData;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}

export async function updateProduct(product: Product): Promise<Product | null> {
  try {
    // Update specifications first if they exist
    if (product.specifications) {
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
        is_active: product.is_active
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

    return productData;
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
