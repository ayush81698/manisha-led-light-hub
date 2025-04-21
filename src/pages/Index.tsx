
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProductCarousel from '@/components/home/ProductCarousel';

// Sample data for the carousel
const featuredProducts = [
  {
    id: '1',
    name: '5W Round Housing',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: '10W Square Housing',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: '24W Street Light Housing',
    image: '/placeholder.svg'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Manisha Enterprises</h2>
            <p className="text-lg text-gray-600 mb-8">
              With years of expertise in LED light housing manufacturing, we deliver
              premium quality products that meet international standards. Our commitment
              to innovation and excellence makes us the preferred choice for businesses
              worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 rounded-lg bg-neutral-50">
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-gray-600">Premium materials and rigorous testing</p>
              </div>
              <div className="p-6 rounded-lg bg-neutral-50">
                <h3 className="font-semibold mb-2">Bulk Orders</h3>
                <p className="text-gray-600">Competitive pricing for wholesale buyers</p>
              </div>
              <div className="p-6 rounded-lg bg-neutral-50">
                <h3 className="font-semibold mb-2">Custom Solutions</h3>
                <p className="text-gray-600">Tailored to your specific requirements</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
