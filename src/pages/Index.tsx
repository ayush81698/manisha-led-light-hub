
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import { fetchProducts } from '@/data/products';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: '1',
      name: '5W Round LED Housing',
      images: ['/placeholder.svg']
    },
    {
      id: '2',
      name: '10W Square LED Housing',
      images: ['/placeholder.svg']
    },
    {
      id: '3',
      name: '24W LED Street Light Housing',
      images: ['/placeholder.svg']
    }
  ]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        const activeProducts = products.filter(p => p.is_active).slice(0, 3);
        if (activeProducts.length > 0) {
          // Map to the format expected by FeaturedProductsSection
          const formattedProducts = activeProducts.map(p => ({
            id: p.id || '',
            name: p.name,
            images: p.images || [p.image_url || '/placeholder.svg']
          }));
          setFeaturedProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Failed to load featured products:', error);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>LED Street Light Housings - Manisha Enterprises</title>
        <meta name="description" content="Premium manufacturer of LED street light housings, commercial LED housings and industrial lighting solutions. Bulk orders available with custom specifications." />
        <link rel="canonical" href="https://manisha-enterprises.com/" />
      </Helmet>
      
      <HeroSection />
      
      <FeaturedProductsSection products={featuredProducts} />

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 dark:text-white text-center">Premium LED Street Light Housings Manufacturer</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              With years of expertise in LED light housing manufacturing, Manisha Enterprises delivers
              premium quality LED street light housings and commercial LED fixtures that meet international standards. Our commitment
              to innovation and excellence makes us the preferred choice for LED lighting housing solutions worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 rounded-lg bg-neutral-50 dark:bg-gray-800">
                <h3 className="font-semibold mb-2 dark:text-white">Quality Assured</h3>
                <p className="text-gray-600 dark:text-gray-300">Premium materials and rigorous testing ensure our LED street light housings last longer</p>
              </div>
              <div className="p-6 rounded-lg bg-neutral-50 dark:bg-gray-800">
                <h3 className="font-semibold mb-2 dark:text-white">Bulk Orders</h3>
                <p className="text-gray-600 dark:text-gray-300">Competitive pricing for wholesale LED housing buyers</p>
              </div>
              <div className="p-6 rounded-lg bg-neutral-50 dark:bg-gray-800">
                <h3 className="font-semibold mb-2 dark:text-white">Custom Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300">Tailored LED street light enclosures to your specific requirements</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-white text-center">Why Choose Our LED Street Light Housings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 dark:text-white">Durable Construction</h3>
                <p className="text-gray-600 dark:text-gray-300">Our LED housings are built with high-grade aluminum and robust materials for longevity</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 dark:text-white">Heat Dissipation</h3>
                <p className="text-gray-600 dark:text-gray-300">Superior thermal management in our LED light housings extends component life</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 dark:text-white">Weather Resistant</h3>
                <p className="text-gray-600 dark:text-gray-300">IP-rated street light enclosures designed to withstand harsh weather conditions</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2 dark:text-white">Customizable Options</h3>
                <p className="text-gray-600 dark:text-gray-300">Flexible design options for all types of LED lighting applications</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <WhatsAppButton />
    </div>
  );
};

export default Index;
