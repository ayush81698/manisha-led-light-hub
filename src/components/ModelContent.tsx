
import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ModelContentProps {
  validatedModelUrl: string;
  onLoaded?: () => void;
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

export const ModelContent: React.FC<ModelContentProps> = ({ validatedModelUrl, onLoaded }) => {
  const modelRef = useRef<THREE.Group | null>(null);
  const { scene, animations } = useGLTF(validatedModelUrl, true) as GLTFResult;
  
  // Call onLoaded when the scene is available
  useEffect(() => {
    if (scene && onLoaded) {
      // Slight delay to ensure the model is processed
      const timer = setTimeout(() => {
        onLoaded();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scene, onLoaded]);
  
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
      <directionalLight position={[-5, -10, -5]} intensity={0.8} />
      <hemisphereLight args={["#ffffff", "#8888ff", 0.8]} />
      <primitive 
        ref={modelRef} 
        object={scene} 
        scale={1.5} 
        position={[0, 0, 0]} 
      />
    </>
  );
};

// Helper function to ensure materials are properly configured
function ensureProperMaterial(material: THREE.Material) {
  if (material instanceof THREE.MeshStandardMaterial) {
    // Enhance standard materials
    material.roughness = Math.min(material.roughness, 0.6); // Reduce roughness for better reflections
    material.metalness = Math.max(material.metalness, 0.3); // Ensure some metalness for better reflections
    material.envMapIntensity = 1.2; // Enhance environment reflections
    
    // Preserve original color but enhance if too dark
    if (material.color) {
      const brightness = material.color.r + material.color.g + material.color.b;
      if (brightness < 0.3) {
        material.color.multiplyScalar(1.8); // Brighten dark colors
      }
    }
  } else if (material instanceof THREE.MeshBasicMaterial) {
    // Basic materials might need more color enhancement
    if (material.color) {
      const brightness = material.color.r + material.color.g + material.color.b;
      if (brightness < 0.2) {
        material.color.multiplyScalar(2); // Significantly brighten very dark colors
      }
    }
  } else if (material instanceof THREE.MeshPhongMaterial) {
    // Enhance phong materials
    material.shininess = Math.max(material.shininess, 50);
    material.specular = new THREE.Color(0x333333);
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

// Add TypeScript declaration for model-viewer web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string;
          alt: string;
          'auto-rotate'?: boolean;
          'camera-controls'?: boolean;
          ar?: boolean;
          'ar-modes'?: string;
          'environment-image'?: string;
          'shadow-intensity'?: string;
          loading?: string;
          reveal?: string;
        },
        HTMLElement
      >;
    }
  }
}
