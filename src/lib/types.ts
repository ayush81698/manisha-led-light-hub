export interface HeroSettings {
  backgroundType: 'image' | 'video' | 'color';
  backgroundValue: string;
}

interface SectionSettings {
  backgroundType: 'image' | 'video' | 'color';
  backgroundValue: string;
}

interface HeroSettings extends SectionSettings {}

export type { HeroSettings, SectionSettings };
