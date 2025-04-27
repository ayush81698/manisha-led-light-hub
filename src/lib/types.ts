
export interface SectionSettings {
  backgroundType: 'image' | 'video' | 'color';
  backgroundValue: string;
}

export type HeroSettings = SectionSettings;

// Type declaration for Google's Model Viewer properties
export interface ModelViewerProps {
  src: string;
  alt: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  ar?: boolean;
  arModes?: string;
  environmentImage?: string;
  shadowIntensity?: string;
  loading?: 'eager' | 'lazy' | 'auto';
  reveal?: 'auto' | 'interaction' | 'manual';
  style?: React.CSSProperties;
}
