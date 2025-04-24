
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { HamsterLoader } from '@/components/ui/hamster-loader';

interface ModelProps {
  modelUrl: string;
}

function Model({ modelUrl }: ModelProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add error handling for the model loading
    const handleError = () => {
      setError("Failed to load 3D model");
      console.error(`Failed to load model from URL: ${modelUrl}`);
    };

    // Attempt to check if the URL is accessible
    if (modelUrl.startsWith('blob:')) {
      fetch(modelUrl)
        .catch(() => {
          setError("This 3D model is no longer available (blob URL expired)");
        });
    }
  }, [modelUrl]);

  if (error) {
    return (
      <Html center>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please try uploading the model again.
          </p>
        </div>
      </Html>
    );
  }

  try {
    const gltf = useGLTF(modelUrl);
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
