
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      description: '',
      wattage: 5,
      shape: 'Round',
      material: 'Aluminum',
      color: 'Silver',
      images: ['/placeholder.svg'],
      isActive: true,
    }
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setImageFiles([...imageFiles, newFile]);
      
      // In a real app, you would upload the file to storage here
      // For now, we'll create a local URL for preview
      const fileUrl = URL.createObjectURL(newFile);
      setFormData({
        ...formData,
        images: [...(formData.images || []), fileUrl],
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages.length > 0 ? updatedImages : ['/placeholder.svg'],
    });

    // Also remove from imageFiles if present
    if (index < imageFiles.length) {
      const updatedFiles = [...imageFiles];
      updatedFiles.splice(index, 1);
      setImageFiles(updatedFiles);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrl && imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageUrl.trim()],
      });
      setImageUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would upload the image files to storage here
    // and then save the product data to the database
    
    onSubmit(formData);
    toast({
      title: product ? "Product Updated" : "Product Created",
      description: `${formData.name} has been ${product ? 'updated' : 'saved'} successfully.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wattage">Wattage *</Label>
              <Input
                id="wattage"
                name="wattage"
                type="number"
                min="1"
                value={formData.wattage}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shape">Shape *</Label>
              <Select
                value={formData.shape}
                onValueChange={(value) => handleSelectChange('shape', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Square">Square</SelectItem>
                  <SelectItem value="Rectangular">Rectangular</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material">Material *</Label>
              <Select
                value={formData.material}
                onValueChange={(value) => handleSelectChange('material', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aluminum">Aluminum</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Steel">Steel</SelectItem>
                  <SelectItem value="Composite">Composite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.images && formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="h-20 w-20 border rounded overflow-hidden">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="h-5 w-5 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddImageUrl}
                    className="flex-shrink-0"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* This would be expanded with all the specification fields in a real application */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
                <Input
                  id="minOrderQuantity"
                  name="minOrderQuantity"
                  type="number"
                  min="1"
                  placeholder="E.g., 50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ipRating">IP Rating</Label>
                <Input
                  id="ipRating"
                  name="ipRating"
                  placeholder="E.g., IP65"
                />
              </div>
              
              {/* More specification fields would be added here */}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? 'Update Product' : 'Save Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
