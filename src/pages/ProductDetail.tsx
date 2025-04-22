
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { fetchProducts, saveInquiry, Product, ProductSpecifications } from '@/data/products';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProductModelViewer } from '@/components/ProductModelViewer';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState('1');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'image' | '3d'>('image');
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_specifications(*),
            product_images(image_url)
          `)
          .eq('id', productId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform data to match our Product interface
          const formattedProduct: Product = {
            id: data.id,
            name: data.name,
            description: data.description,
            wattage: data.wattage,
            shape: data.shape as 'Round' | 'Square' | 'Rectangular' | 'Custom',
            material: data.material,
            color: data.color,
            is_active: data.is_active,
            specifications: data.product_specifications as ProductSpecifications,
            images: data.product_images?.map((img: any) => img.image_url) || [],
            image_url: data.image_url,
            price: data.price,
            model_url: data.model_url
          };
          
          setProduct(formattedProduct);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId]);

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images!.length - 1 : prevIndex - 1
      );
    }
  };
  
  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !quantity || !phone) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save inquiry to database
      const { data, error } = await supabase
        .from('inquiries')
        .insert({
          product_id: productId,
          quantity: parseInt(quantity),
          phone,
          notes: notes || "",
          status: "New"
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Inquiry Submitted",
        description: "We'll contact you shortly regarding your inquiry.",
      });
      
      // Reset form
      setQuantity('1');
      setPhone('');
      setNotes('');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to submit your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">Loading product...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Product Not Found</h2>
        <p className="mb-6 dark:text-gray-300">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }
  
  // Build specification list from product data
  const specificationsList = [
    { label: 'Wattage', value: `${product.wattage}W` },
    { label: 'Shape', value: product.shape },
    { label: 'Material', value: product.material },
    { label: 'Color', value: product.color },
  ];
  
  // Add specifications from the product specifications object if it exists
  if (product.specifications) {
    if (product.specifications.min_order_quantity) {
      specificationsList.push({ label: 'Minimum Order Quantity', value: `${product.specifications.min_order_quantity} units` });
    }
    if (product.specifications.usage_application) {
      specificationsList.push({ label: 'Usage/Application', value: product.specifications.usage_application });
    }
    if (product.specifications.brand) {
      specificationsList.push({ label: 'Brand', value: product.specifications.brand });
    }
    if (product.specifications.beam_angle) {
      specificationsList.push({ label: 'Beam Angle', value: product.specifications.beam_angle });
    }
    if (product.specifications.ip_rating) {
      specificationsList.push({ label: 'IP Rating', value: product.specifications.ip_rating });
    }
    if (product.specifications.body_material || product.material) {
      specificationsList.push({ label: 'Body Material', value: product.specifications.body_material || product.material });
    }
    if (product.specifications.lighting_type) {
      specificationsList.push({ label: 'Lighting Type', value: product.specifications.lighting_type });
    }
    if (product.specifications.input_voltage) {
      specificationsList.push({ label: 'Input Voltage', value: product.specifications.input_voltage });
    }
    if (product.specifications.frequency) {
      specificationsList.push({ label: 'Frequency', value: product.specifications.frequency });
    }
    if (product.specifications.item_weight) {
      specificationsList.push({ label: 'Item Weight', value: product.specifications.item_weight });
    }
    if (product.specifications.phase) {
      specificationsList.push({ label: 'Phase', value: product.specifications.phase });
    }
    if (product.specifications.pcb_area_size) {
      specificationsList.push({ label: 'PCB Area Size', value: product.specifications.pcb_area_size });
    }
    if (product.specifications.driver_area_size) {
      specificationsList.push({ label: 'Driver Area Size', value: product.specifications.driver_area_size });
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/products')}
        className="mb-6"
      >
        ← Back to Products
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Image/3D Model Viewer */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center justify-center relative">
          {product.model_url && (
            <div className="flex justify-center gap-2 mb-4">
              <Button 
                variant={viewMode === 'image' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('image')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                View Images
              </Button>
              <Button 
                variant={viewMode === '3d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('3d')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                View 3D Model
              </Button>
            </div>
          )}
          
          {viewMode === 'image' ? (
            <>
              <img 
                src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : product.image_url || '/placeholder.svg'} 
                alt={product.name} 
                className="max-h-96 object-contain"
              />

              {product.images && product.images.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-4 bg-white bg-opacity-50 hover:bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-50 dark:hover:bg-opacity-70"
                    onClick={prevImage}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-4 bg-white bg-opacity-50 hover:bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-50 dark:hover:bg-opacity-70"
                    onClick={nextImage}
                  >
                    <ChevronRight size={16} />
                  </Button>
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1">
                    {product.images.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full cursor-pointer ${currentImageIndex === index ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                        onClick={() => setCurrentImageIndex(index)}
                      ></div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="h-96 w-full">
              <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader className="animate-spin" /></div>}>
                {product.model_url && <ProductModelViewer modelUrl={product.model_url} />}
              </Suspense>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Product Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specificationsList.map((spec, index) => (
                  <div key={index} className="flex justify-between border-b dark:border-gray-700 pb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{spec.label}:</span>
                    <span className="text-gray-600 dark:text-gray-400">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Bulk Inquiry</h2>
              <form onSubmit={handleInquiry} className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes (Optional)
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  Submit Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
