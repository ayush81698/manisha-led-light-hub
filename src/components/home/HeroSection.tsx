
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { themeColors } from '@/lib/theme-colors';
import { HeroSettings } from '@/lib/types';

const HeroSection = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<HeroSettings>({
    backgroundType: 'color',
    backgroundValue: '#0047AB'
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('heroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleContactSales = () => {
    const phoneNumber = '+919876543210';
    window.location.href = `tel:${phoneNumber}`;
  };

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'color':
        return { background: settings.backgroundValue };
      case 'image':
        return { 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${settings.backgroundValue})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      case 'video':
        return { 
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000'
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative h-[600px] flex items-center justify-center text-white" style={getBackgroundStyle()}>
      {settings.backgroundType === 'video' && (
        <div className="absolute inset-0 pointer-events-none">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${settings.backgroundValue}?autoplay=1&mute=1&controls=0&loop=1&playlist=${settings.backgroundValue}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh', pointerEvents: 'none' }}
          />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Premium LED Light Housings
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Manisha Enterprises specializes in manufacturing high-quality LED light housings
            for industrial and commercial applications.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-[#FFD700] text-[#0047AB] hover:bg-[#FFE55C]"
              size="lg"
            >
              Explore Products
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#0047AB]"
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
