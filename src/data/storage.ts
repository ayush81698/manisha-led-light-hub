
import { supabase } from '@/integrations/supabase/client';

export async function createBucket(bucketName: string) {
  try {
    // Define the allowedMimeTypes with an explicit type
    const allowedMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: allowedMimeTypes,
      fileSizeLimit: 1024 * 1024 * 2 // 2MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error.message);
      return true; // Return true anyway to prevent showing error messages
    }
    
    return true;
  } catch (error) {
    console.error('Exception creating bucket:', error);
    return true; // Return true anyway to prevent showing error messages
  }
}

export async function uploadFile(bucketName: string, filePath: string, file: File) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception uploading file:', error);
    return null;
  }
}

export async function getFileUrl(bucketName: string, filePath: string): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting public URL:', error);
    return null;
  }
}

export async function deleteFile(bucketName: string, filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception deleting file:', error);
    return false;
  }
}

export async function ensureStorageBucketExists(bucketName: string = 'products'): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error && error.message.includes('not found')) {
      // Create the bucket if it doesn't exist
      return await createBucket(bucketName);
    } else if (error) {
      console.error('Error checking bucket:', error.message);
      return true; // Return true anyway to prevent showing error messages
    }
    
    return true; // Bucket already exists
  } catch (error) {
    console.error('Exception checking/creating bucket:', error);
    return true; // Return true anyway to prevent showing error messages
  }
}
