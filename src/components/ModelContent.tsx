
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';

interface ModelContentProps {
  validatedModelUrl: string;
}

export const ModelContent: React.FC<ModelContentProps> = ({ validatedModelUrl }) => {
  try {
    console.log("Loading 3D model from URL:", validatedModelUrl);
    const gltf = useGLTF(validatedModelUrl, true);
    
    if (!gltf || !gltf.scene) {
      console.error("GLTF loading issue - scene not available");
      return (
        <Html center>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <p className="text-red-500 mb-2">Error loading 3D model</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The model may be corrupted or in an unsupported format.
            </p>
          </div>
        </Html>
      );
    }
    
    return <primitive object={gltf.scene} scale={1.5} position={[0, 0, 0]} />;
  } catch (err) {
    console.error("Error loading 3D model:", err);
    return (
      <Html center>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-2">Failed to load 3D model</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Error details: {err instanceof Error ? err.message : 'Unknown error'}
          </p>
        </div>
      </Html>
    );
  }
};
