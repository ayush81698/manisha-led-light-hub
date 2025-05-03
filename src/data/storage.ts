
import { supabase } from '@/integrations/supabase/client';

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
