
import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
}

export const HamsterLoader: React.FC<LoaderProps> = ({ fullScreen = false }) => {
  return (
    <div className={`loader-wrapper ${fullScreen ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center' : ''}`}>
      <div className="wheel-and-hamster" role="img" aria-label="Hamster in wheel">
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>
    </div>
  );
};
