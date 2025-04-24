
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { HamsterLoader } from '@/components/ui/hamster-loader';
import { supabase } from '@/integrations/supabase/client';

interface ModelProps {
  modelUrl: string;
}

function Model({ modelUrl }: ModelProps) {
  const [error, setError] = useState<string | null>(null);
  const [validatedModelUrl, setValidatedModelUrl] = useState<string | null>(null);

  useEffect(() => {
    const validateModelUrl = async () => {
      try {
        // If it's a blob URL, we need to upload it to Supabase storage
        if (modelUrl.startsWith('blob:')) {
          const blobResponse = await fetch(modelUrl);
          const blobFile = await blobResponse.blob();
          
          // Generate a unique filename
          const fileName = `model_${Date.now()}.glb`;
          
          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-models')
            .upload(fileName, blobFile, {
              contentType: 'model/gltf-binary'
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            setError('Failed to upload 3D model');
            return;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('product-models')
            .getPublicUrl(fileName);

          setValidatedModelUrl(urlData.publicUrl);
        } else {
          // Validate existing URL
          const response = await fetch(modelUrl, { method: 'HEAD' });
          if (!response.ok) {
            setError('Invalid model URL');
            return;
          }
          setValidatedModelUrl(modelUrl);
        }
      } catch (err) {
        console.error('Model validation error:', err);
        setError('Failed to validate 3D model');
      }
    };

    validateModelUrl();
  }, [modelUrl]);

  if (error) {
    return (
      <Html center>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please upload a valid 3D model.
          </p>
        </div>
      </Html>
    );
  }

  if (!validatedModelUrl) {
    return <Html center><HamsterLoader /></Html>;
  }

  try {
    const gltf = useGLTF(validatedModelUrl);
    return <primitive object={gltf.scene} scale={1.5} position={[0, 0, 0]} />;
  } catch (err) {
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
