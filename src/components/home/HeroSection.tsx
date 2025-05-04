
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
    window.location.href = "tel:+919967798888";
  };

  const getYoutubeId = (url: string): string => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-between text-white bg-black/60">
      {settings.backgroundType === 'video' && settings.backgroundValue ? (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <iframe
            className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] transform -translate-x-1/2 -translate-y-1/2 scale-[3] md:scale-[2]"
            src={`https://www.youtube.com/embed/${getYoutubeId(settings.backgroundValue)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYoutubeId(settings.backgroundValue)}&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : settings.backgroundType === 'image' ? (
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${settings.backgroundValue})` 
          }}
        />
      ) : (
        <div 
          className="absolute top-0 left-0 w-full h-full z-0" 
          style={{ backgroundColor: settings.backgroundValue }}
        />
      )}

      {/* Top Section - Title */}
      <div className="relative z-10 mt-28 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Premium LED Light Housings
        </h1>
      </div>

      {/* Bottom Section - Buttons */}
      <div className="relative z-10 mb-20 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate('/products')}
          className="bg-yellow-400 text-black font-semibold px-6 py-3 hover:bg-yellow-500 transition duration-300"
        >
          Explore Products
        </Button>
        <Button
          onClick={handleContactSales}
          className="bg-yellow-400 text-black font-semibold px-6 py-3 hover:bg-yellow-500 transition duration-300"
        >
          Contact Sales
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
