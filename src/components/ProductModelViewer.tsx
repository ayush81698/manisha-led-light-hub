
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { HamsterLoader } from '@/components/ui/hamster-loader';
import { validateModelUrl } from '@/utils/modelValidation';
import { ModelContent } from './ModelContent';
import { UploadProgress } from './UploadProgress';
import { Button } from './ui/button';

interface ModelProps {
  modelUrl: string;
}

function Model({ modelUrl }: ModelProps) {
  const [error, setError] = useState<string | null>(null);
  const [validatedModelUrl, setValidatedModelUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [retries, setRetries] = useState<number>(0);
  const [useArView, setUseArView] = useState<boolean>(false);

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
      
      // Auto-retry on error with a limit
      if (retries < 2) {
        console.log(`Auto-retrying model load (attempt ${retries + 1})...`);
        setRetries(prev => prev + 1);
        setTimeout(() => handleModelValidation(), 1000);
      }
    }
  }, [modelUrl, isUploading, retries]);

  useEffect(() => {
    handleModelValidation();
  }, [handleModelValidation]);
  
  // Check if device supports AR
  useEffect(() => {
    const checkArSupport = () => {
      // Check if the browser supports WebXR
      if ('xr' in navigator) {
        return true;
      }
      // iOS devices with AR QuickLook support
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      return isIOS;
    };
    
    setUseArView(checkArSupport());
  }, []);

  // If we're uploading or have upload progress, show the upload progress component
  if (isUploading || uploadProgress !== null) {
    // This will be displayed outside the Canvas
    return null;
  }

  // If there's an error, render the error message
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

  // Special case: AR view is purely handled through model-viewer outside the Canvas
  if (useArView && validatedModelUrl) {
    // For AR, we'll return null here because we'll handle AR view outside the Canvas
    return null;
  }

  if (!validatedModelUrl || !isModelLoaded) {
    return <Html center><HamsterLoader /></Html>;
  }

  return (
    <Suspense fallback={<Html center><HamsterLoader /></Html>}>
      <ModelContent 
        validatedModelUrl={validatedModelUrl} 
        onLoaded={() => setIsModelLoaded(true)} 
      />
    </Suspense>
  );
}

export const ProductModelViewer: React.FC<ModelProps> = ({ modelUrl }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  // Get model validation state from the Model component
  const [validatedModelUrl, setValidatedModelUrl] = useState<string | null>(null);
  const [useArView, setUseArView] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Handle model validation at this level to access the URL for AR
  const handleModelValidation = useCallback(async () => {
    try {
      if (!modelUrl) return;

      const url = await validateModelUrl(
        modelUrl,
        (progress) => setUploadProgress(progress),
        (uploading) => setIsUploading(uploading)
      );
      
      setValidatedModelUrl(url);
    } catch (error) {
      console.error('Model validation error:', error);
    }
  }, [modelUrl]);

  useEffect(() => {
    handleModelValidation();
  }, [handleModelValidation]);

  useEffect(() => {
    // Load Google Model Viewer script if not already loaded
    if (!document.querySelector('script#model-viewer-script')) {
      const script = document.createElement('script');
      script.id = 'model-viewer-script';
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }

    // Check if device supports AR
    const checkArSupport = () => {
      if ('xr' in navigator) {
        return true;
      }
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      return isIOS;
    };
    
    setUseArView(checkArSupport());
  }, []);

  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No 3D model available</p>
      </div>
    );
  }

  // Show upload progress outside of the Canvas
  if (isUploading || uploadProgress !== null) {
    return <UploadProgress progress={uploadProgress || 0} />;
  }

  // If we have AR support and a validated model URL, use the model-viewer
  if (useArView && validatedModelUrl && scriptLoaded) {
    return (
      <div className="w-full h-full flex flex-col">
        <model-viewer 
          src={validatedModelUrl}
          alt="3D Model"
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          environment-image="neutral"
          shadow-intensity="1"
          style={{width: '100%', height: '100%'}}
          loading="eager"
          reveal="auto"
        >
          <div slot="poster" className="flex items-center justify-center h-full w-full bg-gray-100">
            <HamsterLoader />
          </div>
          <div slot="ar-button" className="absolute bottom-4 right-4">
            <Button className="bg-primary text-white px-4 py-2 rounded-md shadow-md z-10">
              View in AR
            </Button>
          </div>
        </model-viewer>
      </div>
    );
  }

  // For non-AR view, use React Three Fiber
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#f0f0f0']} />
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.8} />
      <Suspense fallback={<Html center><HamsterLoader /></Html>}>
        <Model modelUrl={modelUrl} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enableZoom={true} autoRotate={false} autoRotateSpeed={1} />
    </Canvas>
  );
};

export default ProductModelViewer;
