import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import { products } from '@/data/products';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: '1',
      name: '5W Round Housing',
      images: ['/placeholder.svg']
    },
    {
      id: '2',
      name: '10W Square Housing',
      images: ['/placeholder.svg']
    },
    {
      id: '3',
      name: '24W Street Light Housing',
      images: ['/placeholder.svg']
    }
  ]);

  useEffect(() => {
    // In a real app, this would fetch active products from a database
    const activeProducts = products.filter(p => p.isActive).slice(0, 3);
    if (activeProducts.length > 0) {
      setFeaturedProducts(activeProducts);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <FeaturedProductsSection products={featuredProducts} />

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
