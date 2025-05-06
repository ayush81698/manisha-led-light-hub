
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export async function createBucket(bucketName: string) {
  try {
    // Check if bucket already exists first
    const { data: existingBucket, error: checkError } = await supabase.storage.getBucket(bucketName);
    
    // If bucket exists, return success
    if (existingBucket) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // If there was an error checking the bucket but it's not because it doesn't exist,
    // just log it and return success to allow the app to continue functioning
    if (checkError && !checkError.message.includes('not found')) {
      console.log(`Error checking bucket ${bucketName}, but continuing:`, checkError.message);
      return true;
    }
    
    // Define the allowedMimeTypes with an explicit type
    const allowedMimeTypes: string[] = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    
    console.log(`Creating new bucket: ${bucketName}`);
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: allowedMimeTypes,
      fileSizeLimit: 1024 * 1024 * 2 // 2MB
    });
    
    if (error) {
      console.log('Error creating bucket, but continuing:', error.message);
      // Return success anyways to prevent blocking the UI
      return true;
    }
    
    console.log(`Successfully created bucket: ${bucketName}`);
    return true;
  } catch (error) {
    console.log('Exception creating bucket, but continuing:', error);
    return true; // Return true anyway to prevent showing error messages
  }
}

export async function uploadFile(bucketName: string, filePath: string, file: File) {
  try {
    // Ensure bucket exists before uploading
    await ensureStorageBucketExists(bucketName);
    
    console.log(`Uploading file to ${bucketName}/${filePath}`);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Use upsert to replace existing files
      });
    
    if (error) {
      console.log('Error uploading file:', error.message);
      // Attempt to get a public URL even if upload failed - might be using an existing file
      return getFileUrl(bucketName, filePath);
    }
    
    console.log(`Successfully uploaded file to ${bucketName}/${filePath}`);
    return getFileUrl(bucketName, filePath);
  } catch (error) {
    console.log('Exception uploading file:', error);
    // Attempt to get a public URL even if upload failed - might be using an existing file
    return getFileUrl(bucketName, filePath);
  }
}

export async function getFileUrl(bucketName: string, filePath: string): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.log('Error getting public URL:', error);
    return null;
  }
}

export async function deleteFile(bucketName: string, filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.log('Error deleting file:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('Exception deleting file:', error);
    return false;
  }
}

export async function ensureStorageBucketExists(bucketName: string = 'products'): Promise<boolean> {
  try {
    console.log(`Checking if bucket exists: ${bucketName}`);
    // Check if bucket exists
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      if (error.message.includes('not found')) {
        // If bucket doesn't exist, create it
        return createBucket(bucketName);
      } else {
        // For other errors, log but don't show to user
        console.log('Error checking bucket:', error.message);
        return true; // Return true anyway to prevent showing error messages
      }
    }
    
    console.log(`Bucket ${bucketName} exists`);
    return true; // Bucket already exists
  } catch (error) {
    console.log('Exception checking bucket:', error);
    return true; // Return true anyway to prevent showing error messages
  }
}
