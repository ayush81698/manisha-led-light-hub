
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';

interface ModelContentProps {
  validatedModelUrl: string;
}

export const ModelContent: React.FC<ModelContentProps> = ({ validatedModelUrl }) => {
  const { scene, errors } = useGLTF(validatedModelUrl, true);
  
  if (errors?.length || !scene) {
    console.error("GLTF loading error:", errors);
    return (
      <Html center>
        <div className="bg-black bg-opacity-75 p-4 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-2">Error loading 3D model</p>
          <p className="text-sm text-gray-200">
            {errors?.length ? errors[0].message : 'Unable to load 3D model'}
          </p>
        </div>
      </Html>
    );
  }
  
  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
};
