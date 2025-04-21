
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { themeColors } from '@/lib/theme-colors';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleContactSales = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-[#0047AB] to-[#002147] text-white">
      <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg')] bg-repeat"></div>
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
