import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { HamsterLoader } from '@/components/ui/hamster-loader';
import { validateModelUrl } from '@/utils/modelValidation';
import { ModelContent } from './ModelContent';
import { UploadProgress } from './UploadProgress';

interface ModelProps {
  modelUrl: string;
}

function Model({ modelUrl }: ModelProps) {
  const [error, setError] = useState<string | null>(null);
  const [validatedModelUrl, setValidatedModelUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleModelValidation = useCallback(async () => {
    try {
      if (!modelUrl) {
        setError('No model URL provided');
        return;
      }

      const url = await validateModelUrl(
        modelUrl,
        (progress) => setUploadProgress(progress),
        (uploading) => setIsUploading(uploading)
      );
      
      setValidatedModelUrl(url);
      
      if (isUploading) {
        setTimeout(() => {
          setUploadProgress(null);
          setIsUploading(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Model validation error:', err);
      setError(err instanceof Error ? err.message : String(err));
      setUploadProgress(null);
      setIsUploading(false);
    }
  }, [modelUrl, isUploading]);

  useEffect(() => {
    handleModelValidation();
  }, [handleModelValidation]);

  if (isUploading || uploadProgress !== null) {
    return <UploadProgress progress={uploadProgress || 0} />;
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

  return (
    <Suspense fallback={<Html center><HamsterLoader /></Html>}>
      <ModelContent validatedModelUrl={validatedModelUrl} />
    </Suspense>
  );
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
      <color attach="background" args={['#f0f0f0']} />
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Suspense fallback={<Html center><HamsterLoader /></Html>}>
        <Model modelUrl={modelUrl} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={1} />
    </Canvas>
  );
};

export default ProductModelViewer;
