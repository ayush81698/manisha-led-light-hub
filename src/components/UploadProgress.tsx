
import React from 'react';
import { Html } from '@react-three/drei';

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <Html center>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center">
        <p className="text-blue-500 mb-2">Uploading model to storage: {progress}%</p>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
};
