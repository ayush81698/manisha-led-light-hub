
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { HeroSettings } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<HeroSettings>({
    backgroundType: 'color',
    backgroundValue: '#0047AB'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('name', 'heroSettings')
          .single();

        if (error) {
          console.error('Error loading hero settings from DB:', error);
          const savedSettings = localStorage.getItem('heroSettings');
          if (savedSettings) {
            try {
              setSettings(JSON.parse(savedSettings));
            } catch (error) {
              console.error('Error parsing hero settings from localStorage:', error);
            }
          }
        } else if (data && data.value) {
          const parsedSettings = data.value as unknown as HeroSettings;
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
        console.error('Failed to load hero settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleContactSales = () => {
    navigate('/contact-options');
  };

  const getYoutubeId = (url: string): string => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between text-white" style={getBackgroundStyle()}>
      {settings.backgroundType === 'video' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden z-0">
            <iframe
              className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] transform -translate-x-1/2 -translate-y-1/2 scale-[3] md:scale-[2]"
              src={`https://www.youtube.com/embed/${getYoutubeId(settings.backgroundValue)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYoutubeId(settings.backgroundValue)}&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Top Section - Title */}
      <div className="container mx-auto px-4 relative z-20 mt-10">
        <div className="max-w-3xl mx-auto text-center bg-black bg-opacity-60 backdrop-blur-sm p-4 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Premium LED Light Housings
          </h1>
        </div>
      </div>

      {/* Push buttons to bottom */}
      <div className="container mx-auto px-4 relative z-20 mb-16 flex-grow flex items-end justify-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
  );
};

export default HeroSection;
