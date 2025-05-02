
import React, { useEffect, useState } from 'react';
import ProductCarousel from './ProductCarousel';
import { SectionSettings } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface FeaturedProductsSectionProps {
  products: any[];
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products }) => {
  const [settings, setSettings] = useState<SectionSettings>({
    backgroundType: 'color',
    backgroundValue: '#f9fafb'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        // Try to get settings from Supabase
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('name', 'featuredSettings')
          .single();
          
        if (error) {
          console.error('Error loading featured settings from DB:', error);
          
          // Fallback to localStorage if DB fetch fails
          const savedSettings = localStorage.getItem('featuredSettings');
          if (savedSettings) {
            try {
              setSettings(JSON.parse(savedSettings));
            } catch (error) {
              console.error('Error parsing featured settings from localStorage:', error);
            }
          }
        } else if (data && data.value) {
          // Cast to unknown first, then to the expected type
          const parsedSettings = data.value as unknown as SectionSettings;
          
          // Validate that the parsed settings have the expected structure
          if (
            parsedSettings && 
            typeof parsedSettings === 'object' && 
            'backgroundType' in parsedSettings && 
            'backgroundValue' in parsedSettings
          ) {
            setSettings(parsedSettings);
          }
        }
      } catch (error) {
        console.error('Failed to load featured settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const getYoutubeId = (url: string): string => {
    if (!url) return '';
    
    // Handle various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11)
      ? match[2]
      : url;
  };

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'color':
        return { background: settings.backgroundValue } as const;
      case 'image':
        return { 
          backgroundImage: `url(${settings.backgroundValue})`,
          backgroundSize: 'cover' as const,
          backgroundPosition: 'center' as const,
          position: 'relative' as const,
        };
      case 'video':
        return { 
          position: 'relative' as const,
          overflow: 'hidden' as const,
          backgroundColor: '#000',
          minHeight: '500px' as const
        };
      default:
        return { background: '#f9fafb' } as const;
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-500">Loading featured products...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 relative dark:bg-gray-900" style={getBackgroundStyle()}>
      {settings.backgroundType === 'image' && (
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      )}
      
      {settings.backgroundType === 'video' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${getYoutubeId(settings.backgroundValue)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYoutubeId(settings.backgroundValue)}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              width: '100vw', 
              height: '100vh', 
              pointerEvents: 'none' 
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className={`text-3xl font-bold text-center mb-12 ${(settings.backgroundType === 'image' || settings.backgroundType === 'video') ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          Featured Products
        </h2>
        <div className="backdrop-blur-sm bg-black bg-opacity-30 p-8 rounded-lg">
          <ProductCarousel products={products} />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
