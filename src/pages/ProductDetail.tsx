
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { products, inquiries } from '@/data/products';
import { toast } from '@/components/ui/use-toast';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState('1');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Find the product by ID
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }
  
  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || !phone) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the inquiry to your backend
    // For now, we'll add it to our local inquiries array
    const newInquiry = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      quantity: parseInt(quantity),
      phone,
      notes: notes || "",
      status: "New",
      date: new Date().toLocaleDateString()
    };
    
    // Add to inquiries (in a real app, this would be an API call)
    inquiries.push(newInquiry);
    
    toast({
      title: "Inquiry Submitted",
      description: "We'll contact you shortly regarding your inquiry.",
    });
    
    // Reset form
    setQuantity('1');
    setPhone('');
    setNotes('');
  };
  
  const specificationsList = [
    { label: 'Wattage', value: `${product.wattage}W` },
    { label: 'Shape', value: product.shape },
    { label: 'Material', value: product.material },
    { label: 'Color', value: product.color },
    // In a real application, these would come from the product_specifications table
    { label: 'Minimum Order Quantity', value: '50 units' },
    { label: 'Usage/Application', value: 'Indoor/Outdoor Lighting' },
    { label: 'Brand', value: 'Manisha Enterprises' },
    { label: 'Beam Angle', value: '120°' },
    { label: 'IP Rating', value: 'IP65' },
    { label: 'Body Material', value: product.material },
    { label: 'Lighting Type', value: 'LED' },
    { label: 'Input Voltage', value: '220-240V AC' },
    { label: 'Frequency', value: '50-60Hz' },
    { label: 'Item Weight', value: '0.5kg' },
    { label: 'Phase', value: 'Single Phase' },
    { label: 'PCB Area Size', value: 'Standard' },
    { label: 'Driver Area Size', value: 'Compact' },
  ];
  
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
        {/* Product Image */}
        <div className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-96 object-contain"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-6">{product.description}</p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specificationsList.map((spec, index) => (
                  <div key={index} className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">{spec.label}:</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Bulk Inquiry</h2>
              <form onSubmit={handleInquiry} className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary text-primary hover:bg-secondary/90">
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
