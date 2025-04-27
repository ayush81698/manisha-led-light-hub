
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
    
    // Process materials to ensure proper color rendering
    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.material) {
          // Handle material types
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => {
              ensureProperMaterial(mat);
            });
          } else {
            ensureProperMaterial(node.material);
          }
        }
      }
    });
    
    return (
      <>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <directionalLight position={[-5, -10, -5]} intensity={0.5} />
        <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
      </>
    );
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

// Helper function to ensure materials are properly configured
function ensureProperMaterial(material: THREE.Material) {
  if (material instanceof THREE.MeshStandardMaterial) {
    // Enhance standard materials
    material.roughness = Math.min(material.roughness, 0.7); // Reduce roughness if too high
    material.metalness = Math.max(material.metalness, 0.2); // Ensure some metalness for better reflections
    
    // Preserve original color but enhance if too dark
    if (material.color && material.color.r + material.color.g + material.color.b < 0.2) {
      material.color.multiplyScalar(1.5); // Brighten dark colors
    }
  } else if (material instanceof THREE.MeshBasicMaterial) {
    // Basic materials might need more color enhancement
    if (material.color && material.color.r + material.color.g + material.color.b < 0.1) {
      material.color.multiplyScalar(2); // Significantly brighten very dark colors
    }
  }
  
  // Ensure material takes lighting into account if it's not already
  // Check for flatShading only on materials that support this property
  if (material instanceof THREE.MeshLambertMaterial || 
      material instanceof THREE.MeshPhongMaterial || 
      material instanceof THREE.MeshStandardMaterial || 
      material instanceof THREE.MeshPhysicalMaterial) {
    if (material.flatShading === true) {
      material.flatShading = false; // Use smooth shading
      material.needsUpdate = true;  // Make sure to update the material
    }
  }
}
