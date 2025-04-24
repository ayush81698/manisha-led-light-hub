
import React from 'react';
import FlipProductCard from '@/components/products/FlipProductCard';

interface Product {
  id: string;
  name: string;
  images: string[];
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No products available to display.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <FlipProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductCarousel;
