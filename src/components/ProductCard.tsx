
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Inquiry Submitted",
        description: `We've received your inquiry for ${quantity} units of ${product.name}. Our team will contact you soon.`,
      });
      
      setQuantity('');
      setPhone('');
      setIsSubmitting(false);
    }, 1000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <Card className="w-full h-full product-card-shadow rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="h-48 bg-gray-100 flex items-center justify-center p-4 relative">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
        
        {product.images.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-1 bg-white bg-opacity-50 hover:bg-opacity-70"
              onClick={prevImage}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 bg-white bg-opacity-50 hover:bg-opacity-70"
              onClick={nextImage}
            >
              <ChevronRight size={16} />
            </Button>
            <div className="absolute bottom-1 inset-x-0 flex justify-center gap-1">
              {product.images.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => setCurrentImageIndex(index)}
                ></div>
              ))}
            </div>
          </>
        )}
      </div>
      <CardContent className="p-5">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{product.wattage}W</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-medium">Shape: </span>
              {product.shape}
            </div>
            <div>
              <span className="font-medium">Material: </span>
              {product.material}
            </div>
            <div>
              <span className="font-medium">Color: </span>
              {product.color}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="space-y-1">
            <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">
              Bulk Order Quantity
            </label>
            <Input
              id={`quantity-${product.id}`}
              type="number"
              min="1"
              placeholder="Min. 50 units"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor={`phone-${product.id}`} className="text-sm font-medium">
              Your Phone Number
            </label>
            <Input
              id={`phone-${product.id}`}
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
