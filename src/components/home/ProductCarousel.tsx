
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  images: string[];
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const navigate = useNavigate();
  
  // Add safe check for products array
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
        <Card 
          key={product.id}
          className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <img
              // Add a default image fallback if images array is undefined or empty
              src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
              alt={product.name}
              className="h-40 w-auto object-contain"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold dark:text-white">{product.name}</h3>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-center">
            <Button 
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-secondary text-primary hover:bg-secondary/90"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductCarousel;
