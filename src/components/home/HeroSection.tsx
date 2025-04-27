
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { themeColors } from '@/lib/theme-colors';
import { HeroSettings } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<HeroSettings>({
    backgroundType: 'color',
    backgroundValue: '#0047AB'
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to get settings from Supabase
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('name', 'heroSettings')
          .single();
          
        if (error) {
          console.error('Error loading hero settings from DB:', error);
          
          // Fallback to localStorage if DB fetch fails
          const savedSettings = localStorage.getItem('heroSettings');
          if (savedSettings) {
            try {
              setSettings(JSON.parse(savedSettings));
            } catch (error) {
              console.error('Error parsing hero settings from localStorage:', error);
            }
          }
        } else if (data && data.value) {
          setSettings(data.value);
        }
      } catch (error) {
        console.error('Failed to load hero settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleContactSales = () => {
    navigate('/contact-options');
  };

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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${settings.backgroundValue})`,
          backgroundSize: 'cover' as const,
          backgroundPosition: 'center' as const
        };
      case 'video':
        return { 
          position: 'relative' as const,
          overflow: 'hidden' as const,
          backgroundColor: '#000'
        };
      default:
        return {} as const;
    }
  };

  return (
    <div className="relative h-[600px] flex items-center justify-center text-white" style={getBackgroundStyle()}>
      {settings.backgroundType === 'video' && (
        <div className="absolute inset-0 pointer-events-none">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${getYoutubeId(settings.backgroundValue)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYoutubeId(settings.backgroundValue)}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh', pointerEvents: 'none' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center bg-black bg-opacity-60 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Premium LED Light Housings
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Manisha Enterprises specializes in manufacturing high-quality LED light housings
            for industrial and commercial applications.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-secondary text-primary hover:bg-secondary/90"
              size="lg"
            >
              Explore Products
            </Button>
            <Button 
              variant="outline" 
              className="bg-secondary border-secondary text-primary hover:bg-secondary/90"
              size="lg"
              onClick={handleContactSales}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
