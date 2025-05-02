
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FlipProductCardProps {
  product: Product;
}

const FlipProductCard: React.FC<FlipProductCardProps> = ({ product }) => {
  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/products/${product.id}`;
      
      // Only attempt to use Web Share API if in a secure context
      if (navigator.share && window.isSecureContext) {
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
        // Always fallback to clipboard copy
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste the product link anywhere you want to share it.",
        });
      }
    } catch (error) {
      console.error('Error sharing product:', error);
      
      // Simplified error handling that doesn't expose technical details to users
      toast({
        title: "Sharing failed",
        description: "We couldn't share this product. The link has been copied to your clipboard instead.",
        variant: "destructive"
      });
      
      // Try to copy to clipboard as a fallback
      try {
        const shareUrl = `${window.location.origin}/products/${product.id}`;
        await navigator.clipboard.writeText(shareUrl);
      } catch (clipboardError) {
        console.error('Clipboard fallback failed:', clipboardError);
      }
    }
  };

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
          <div className="flex flex-col gap-2">
            <Link to={`/products/${product.id}`}>
              <Button className="w-full bg-white hover:bg-gray-100 text-primary">
                View Details
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="w-full border-white text-white hover:bg-white hover:text-primary flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 size={16} /> Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipProductCard;
