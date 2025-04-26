
import { supabase } from '@/integrations/supabase/client';

// Cache for already validated models to prevent unnecessary refetching
const validatedModelsCache = new Map<string, string>();

// Constants for Supabase configuration
const SUPABASE_URL = "https://vuocrrpygfcasvvgwnaf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1b2NycnB5Z2ZjYXN2dmd3bmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTM5ODAsImV4cCI6MjA2MDgyOTk4MH0.B9kX4PBgtcjJ1_rGrV24Jg1Ewe50z1dKEhDdM8LM5vw";

export const validateModelUrl = async (modelUrl: string, 
  onUploadProgress?: (progress: number) => void,
  setIsUploading?: (isUploading: boolean) => void
): Promise<string> => {
  try {
    // First check if we've already validated this URL
    if (validatedModelsCache.has(modelUrl)) {
      return validatedModelsCache.get(modelUrl)!;
    }
    
    console.log("Processing model URL:", modelUrl);
    
    // Try a HEAD request to check if URL is directly accessible
    try {
      const response = await fetch(modelUrl, { method: 'HEAD' });
      if (response.ok) {
        console.log("URL is directly accessible:", modelUrl);
        validatedModelsCache.set(modelUrl, modelUrl);
        return modelUrl;
      }
    } catch (headErr) {
      console.log("HEAD request failed, continuing with other checks:", headErr);
    }
    
    // If it's already a Supabase URL, use it directly
    if (modelUrl.includes('supabase') && modelUrl.includes('product-models')) {
      console.log("Already a Supabase URL, using directly");
      validatedModelsCache.set(modelUrl, modelUrl);
      return modelUrl;
    }
    
    // For other valid URLs that are not blob URLs
    if (!modelUrl.startsWith('blob:')) {
      console.log("Using external URL directly:", modelUrl);
      validatedModelsCache.set(modelUrl, modelUrl);
      return modelUrl;
    }
    
    // If it's a blob URL, we need to upload it to Supabase storage
    if (modelUrl.startsWith('blob:')) {
      setIsUploading?.(true);
      onUploadProgress?.(0);
      console.log("Detected blob URL, preparing to upload to Supabase");
      
      try {
        // Fetch the blob
        const blobResponse = await fetch(modelUrl);
        const blobFile = await blobResponse.blob();
        
        if (!blobFile || blobFile.size === 0) {
          throw new Error('Invalid model file');
        }
        
        console.log("Blob file size:", blobFile.size, "bytes");
        
        // Check if file is too large (> 50MB)
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
        if (blobFile.size > MAX_FILE_SIZE) {
          throw new Error(`File size (${(blobFile.size / (1024 * 1024)).toFixed(2)}MB) exceeds the 50MB limit`);
        }
        
        // Generate a unique filename
        const fileName = `model_${Date.now()}.glb`;
        console.log("Generated filename:", fileName);
        
        onUploadProgress?.(10);
        
        // First check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        onUploadProgress?.(20);
        
        if (listError) {
          throw new Error('Failed to access storage: ' + listError.message);
        }
        
        const bucketExists = buckets?.some(bucket => bucket.name === 'product-models');
        
        // Create bucket if it doesn't exist
        if (!bucketExists) {
          console.log("Bucket 'product-models' doesn't exist, creating it");
          
          try {
            // Get authentication session data
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token || '';
            
            // Create bucket with REST API
            const createBucketResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: 'product-models',
                name: 'product-models',
                public: true,
                file_size_limit: 52428800 // 50MB in bytes
              })
            });
            
            if (!createBucketResponse.ok) {
              const errorData = await createBucketResponse.json();
              console.error('REST API bucket creation failed:', errorData);
              
              // Try with supabase client as fallback
              const { error: bucketError } = await supabase.storage.createBucket('product-models', {
                public: true,
                fileSizeLimit: 52428800 // 50MB
              });
              
              if (bucketError) {
                throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
              }
            }
            
            // Set bucket to public
            await fetch(`${SUPABASE_URL}/storage/v1/bucket/product-models`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                public: true
              })
            });
            
          } catch (bucketErr) {
            throw new Error('Error with storage bucket: ' + (bucketErr instanceof Error ? bucketErr.message : String(bucketErr)));
          }
        }
        
        onUploadProgress?.(40);
        console.log("Uploading file to bucket");
        
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-models')
          .upload(fileName, blobFile, {
            contentType: 'model/gltf-binary',
            cacheControl: '3600'
          });

        if (uploadError) {
          throw new Error('Failed to upload 3D model: ' + uploadError.message);
        }
        
        onUploadProgress?.(80);
        console.log("Upload successful:", uploadData);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-models')
          .getPublicUrl(fileName);

        if (!urlData || !urlData.publicUrl) {
          throw new Error('Failed to get public URL for the uploaded model');
        }
        
        console.log("Public URL:", urlData.publicUrl);
        const finalUrl = urlData.publicUrl;
        validatedModelsCache.set(modelUrl, finalUrl);
        onUploadProgress?.(100);
        
        // Return the validated URL
        return finalUrl;
        
      } catch (uploadErr) {
        throw new Error('Exception during upload: ' + (uploadErr instanceof Error ? uploadErr.message : String(uploadErr)));
      }
    }
    
    throw new Error('Invalid model URL');
  } catch (err) {
    throw new Error('Model validation error: ' + (err instanceof Error ? err.message : String(err)));
  }
};
