
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ModelContentProps {
  validatedModelUrl: string;
}

interface GLTFResult {
  scene?: THREE.Group;
  scenes?: THREE.Group[];
  animations?: THREE.AnimationClip[];
  cameras?: THREE.Camera[];
  asset?: {
    version: string;
    generator: string;
  };
  parser?: any;
  userData?: any;
}

export const ModelContent: React.FC<ModelContentProps> = ({ validatedModelUrl }) => {
  try {
    const { scene } = useGLTF(validatedModelUrl, true) as GLTFResult;
    
    if (!scene) {
      console.error("GLTF loading error: Scene is undefined");
      return (
        <Html center>
          <div className="bg-black bg-opacity-75 p-4 rounded-lg shadow-md text-center">
            <p className="text-red-500 mb-2">Error loading 3D model</p>
            <p className="text-sm text-gray-200">
              Unable to load 3D model scene
            </p>
          </div>
        </Html>
      );
    }
    
    return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
  } catch (error) {
    console.error("GLTF loading error:", error);
    return (
      <Html center>
        <div className="bg-black bg-opacity-75 p-4 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-2">Error loading 3D model</p>
          <p className="text-sm text-gray-200">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Html>
    );
  }
};
