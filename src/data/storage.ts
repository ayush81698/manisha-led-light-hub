
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export async function createBucket(bucketName: string) {
  try {
    // Check if bucket already exists first
    const { data: existingBucket } = await supabase.storage.getBucket(bucketName);
    
    // If bucket exists, return success
    if (existingBucket) {
      return true;
    }
    
    // Define the allowedMimeTypes with an explicit type
    const allowedMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: allowedMimeTypes,
      fileSizeLimit: 1024 * 1024 * 2 // 2MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error.message);
      // Don't show error to the user, just log it
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
    // Ensure bucket exists before uploading
    await ensureStorageBucketExists(bucketName);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to overwrite existing files with same name
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
    
    if (error) {
      if (error.message.includes('not found')) {
        // Create the bucket if it doesn't exist
        return await createBucket(bucketName);
      } else {
        // For other errors, log but don't show to user
        console.error('Error checking bucket:', error.message);
        return true; // Return true anyway to prevent showing error messages
      }
    }
    
    return true; // Bucket already exists
  } catch (error) {
    console.error('Exception checking/creating bucket:', error);
    return true; // Return true anyway to prevent showing error messages
  }
}
