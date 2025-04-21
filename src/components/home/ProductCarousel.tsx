
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const rotateCarousel = async () => {
      await controls.start({
        rotateY: [0, 360],
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }
      });
    };

    rotateCarousel();
  }, [controls]);

  return (
    <div className="relative h-[400px] w-full overflow-hidden my-8">
      <motion.div
        ref={containerRef}
        animate={controls}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 preserve-3d"
        style={{ perspective: "1000px" }}
      >
        {products.map((product, index) => {
          const angle = (index / products.length) * 360;
          const radius = 200;
          
          return (
            <Card
              key={product.id}
              className="absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-105 transition-transform"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            >
              <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 object-contain mb-2"
                />
                <p className="text-sm font-medium text-center">{product.name}</p>
              </div>
            </Card>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProductCarousel;
