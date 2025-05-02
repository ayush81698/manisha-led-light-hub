
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Product, saveInquiry } from "@/data/products";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    // Save inquiry to database
    if (product.id) {
      try {
        await saveInquiry(product.id, parseInt(quantity), phone);
        
        toast({
          title: "Inquiry Submitted",
          description: `We've received your inquiry for ${quantity} units of ${product.name}. Our team will contact you soon.`,
        });
        
        setQuantity('');
        setPhone('');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit inquiry. Please try again.",
          variant: "destructive"
        });
      }
    }
    
    setIsSubmitting(false);
  };

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/products/${product.id}`;
    
    try {
      // Use Web Share API if available (primarily mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: shareUrl,
        });
        
        toast({
          title: "Shared successfully",
          description: "The product has been shared using your device's share functionality.",
        });
      } else {
        // Fallback to clipboard for desktop browsers
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste the product link anywhere you want to share it.",
        });
      }
    } catch (error) {
      console.error('Error sharing product:', error);
      toast({
        title: "Sharing failed",
        description: "There was a problem sharing this product.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full h-full product-card-shadow rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        )}
        
        {product.images && product.images.length > 1 && (
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
                  className={`w-2 h-2 rounded-full cursor-pointer ${currentImageIndex === index ? 'bg-primary' : 'bg-gray-300'}`}
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
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h3>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{product.wattage}W</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
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
            {product.specifications?.beam_angle && (
              <div>
                <span className="font-medium">Beam Angle: </span>
                {product.specifications.beam_angle}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
              title="Share this product"
            >
              <Share2 size={18} />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="space-y-1">
            <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <label htmlFor={`phone-${product.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" 
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
