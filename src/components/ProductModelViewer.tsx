
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { HamsterLoader } from '@/components/ui/hamster-loader';
import { supabase } from '@/integrations/supabase/client';

interface ModelProps {
  modelUrl: string;
}

// Cache for already validated models to prevent unnecessary refetching
const validatedModelsCache = new Map<string, string>();

// Constants for Supabase configuration - use directly instead of trying to access protected properties
const SUPABASE_URL = "https://vuocrrpygfcasvvgwnaf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1b2NycnB5Z2ZjYXN2dmd3bmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTM5ODAsImV4cCI6MjA2MDgyOTk4MH0.B9kX4PBgtcjJ1_rGrV24Jg1Ewe50z1dKEhDdM8LM5vw";

function Model({ modelUrl }: ModelProps) {
  const [error, setError] = useState<string | null>(null);
  const [validatedModelUrl, setValidatedModelUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const validateModelUrl = useCallback(async () => {
    try {
      // First check if we've already validated this URL
      if (validatedModelsCache.has(modelUrl)) {
        setValidatedModelUrl(validatedModelsCache.get(modelUrl)!);
        return;
      }
      
      console.log("Processing model URL:", modelUrl);
      
      // If it's already a Supabase URL, use it directly
      if (modelUrl.includes('supabase') && modelUrl.includes('product-models')) {
        console.log("Already a Supabase URL, using directly");
        setValidatedModelUrl(modelUrl);
        validatedModelsCache.set(modelUrl, modelUrl);
        return;
      }
      
      // For other valid URLs that are not blob URLs
      if (!modelUrl.startsWith('blob:')) {
        console.log("Using external URL directly:", modelUrl);
        setValidatedModelUrl(modelUrl);
        validatedModelsCache.set(modelUrl, modelUrl);
        return;
      }
      
      // If it's a blob URL, we need to upload it to Supabase storage
      if (modelUrl.startsWith('blob:')) {
        setIsUploading(true);
        setUploadProgress(0);
        console.log("Detected blob URL, preparing to upload to Supabase");
        
        try {
          // Fetch the blob
          const blobResponse = await fetch(modelUrl);
          const blobFile = await blobResponse.blob();
          
          if (!blobFile || blobFile.size === 0) {
            console.error("Failed to fetch blob or blob is empty");
            setError('Invalid model file');
            setUploadProgress(null);
            setIsUploading(false);
            return;
          }
          
          console.log("Blob file size:", blobFile.size, "bytes");
          
          // Generate a unique filename
          const fileName = `model_${Date.now()}.glb`;
          console.log("Generated filename:", fileName);
          
          setUploadProgress(10);
          
          // First check if bucket exists
          const { data: buckets, error: listError } = await supabase.storage.listBuckets();
          
          setUploadProgress(20);
          
          if (listError) {
            console.error('Error listing buckets:', listError);
            setError('Failed to access storage');
            setUploadProgress(null);
            setIsUploading(false);
            return;
          }
          
          const bucketExists = buckets?.some(bucket => bucket.name === 'product-models');
          
          // Create bucket if it doesn't exist
          if (!bucketExists) {
            console.log("Bucket 'product-models' doesn't exist, creating it");
            
            try {
              // Get authentication token - using getSession() instead of directly accessing session
              const { data: sessionData } = await supabase.auth.getSession();
              const token = sessionData?.session?.access_token || '';
              
              // First try creating bucket with REST API
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
                  file_size_limit: 100000000 // 100MB
                })
              });
              
              if (!createBucketResponse.ok) {
                console.log('Direct REST API bucket creation failed, trying supabase client');
                const { error: bucketError } = await supabase.storage.createBucket('product-models', {
                  public: true,
                  fileSizeLimit: 100000000 // 100MB
                });
                
                if (bucketError) {
                  console.error('Error creating bucket:', bucketError);
                  throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
                }
              }
              
              // Set bucket to public
              const publicBucketResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/product-models`, {
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
              
              console.log('Public bucket response:', publicBucketResponse.ok);
              
            } catch (bucketErr) {
              console.error("Bucket creation error:", bucketErr);
              setError('Error with storage bucket: ' + (bucketErr instanceof Error ? bucketErr.message : String(bucketErr)));
              setUploadProgress(null);
              setIsUploading(false);
              return;
            }
          }
          
          setUploadProgress(40);
          console.log("Uploading file to bucket");
          
          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-models')
            .upload(fileName, blobFile, {
              contentType: 'model/gltf-binary',
              cacheControl: '3600'
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            setError('Failed to upload 3D model: ' + uploadError.message);
            setUploadProgress(null);
            setIsUploading(false);
            return;
          }
          
          setUploadProgress(80);
          console.log("Upload successful:", uploadData);

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('product-models')
            .getPublicUrl(fileName);

          if (!urlData || !urlData.publicUrl) {
            console.error("Failed to get public URL");
            setError('Failed to get public URL for the uploaded model');
            setUploadProgress(null);
            setIsUploading(false);
            return;
          }
          
          console.log("Public URL:", urlData.publicUrl);
          const finalUrl = urlData.publicUrl;
          setValidatedModelUrl(finalUrl);
          validatedModelsCache.set(modelUrl, finalUrl);
          setUploadProgress(100);
          
          // Add a short delay to ensure the URL is accessible
          setTimeout(() => {
            setUploadProgress(null);
            setIsUploading(false);
          }, 1500);
          
        } catch (uploadErr) {
          console.error("Upload exception:", uploadErr);
          setError('Exception during upload: ' + (uploadErr instanceof Error ? uploadErr.message : String(uploadErr)));
          setUploadProgress(null);
          setIsUploading(false);
        }
      }
    } catch (err) {
      console.error('Model validation error:', err);
      setError('Failed to validate 3D model: ' + (err instanceof Error ? err.message : String(err)));
    }
  }, [modelUrl]);

  useEffect(() => {
    if (modelUrl) {
      validateModelUrl();
    } else {
      setError('No model URL provided');
    }
  }, [modelUrl, validateModelUrl]);

  if (isUploading || uploadProgress !== null) {
    return (
      <Html center>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <p className="text-blue-500 mb-2">Uploading model to storage: {uploadProgress}%</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      </Html>
    );
  }

  if (error) {
    return (
      <Html center>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please upload a valid 3D model (.glb format).
          </p>
        </div>
      </Html>
    );
  }

  if (!validatedModelUrl) {
    return <Html center><HamsterLoader /></Html>;
  }

  const ModelContent = () => {
    try {
      console.log("Loading 3D model from URL:", validatedModelUrl);
      const { scene } = useGLTF(validatedModelUrl);
      return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
    } catch (err) {
      console.error("Error loading 3D model:", err);
      return (
        <Html center>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <p className="text-red-500 mb-2">Failed to load 3D model</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The model may be corrupted or in an unsupported format.
            </p>
          </div>
        </Html>
      );
    }
  };

  return <Suspense fallback={<Html center><HamsterLoader /></Html>}>
    <ModelContent />
  </Suspense>;
}

export const ProductModelViewer: React.FC<ModelProps> = ({ modelUrl }) => {
  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No 3D model available</p>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={<Html center><HamsterLoader /></Html>}>
        <Model modelUrl={modelUrl} />
      </Suspense>
      <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={1} />
    </Canvas>
  );
};

export default ProductModelViewer;
