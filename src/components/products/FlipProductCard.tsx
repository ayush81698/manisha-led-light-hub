
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';

interface FlipProductCardProps {
  product: Product;
}

const FlipProductCard: React.FC<FlipProductCardProps> = ({ product }) => {
  return (
    <div className="flip-card w-full h-[280px]">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img
            src={(product.images && product.images.length > 0) ? product.images[0] : (product.image_url || '/placeholder.svg')}
            alt={product.name}
            className="h-full w-full object-contain p-4"
          />
        </div>
        <div className="flip-card-back">
          <h3 className="title text-lg font-semibold mb-4">{product.name}</h3>
          <Link to={`/products/${product.id}`}>
            <Button className="bg-white hover:bg-gray-100 text-primary">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlipProductCard;
