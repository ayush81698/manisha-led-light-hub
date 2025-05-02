
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Product, ProductSpecifications } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';

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
      images: [],
      is_active: true,
      model_url: '',
      specifications: {
        min_order_quantity: 50,
        usage_application: 'Indoor/Outdoor Lighting',
        brand: 'Manisha Enterprises',
        beam_angle: '120°',
        ip_rating: 'IP65',
        lighting_type: 'LED',
        input_voltage: '220-240V AC',
        frequency: '50-60Hz',
        item_weight: '0.5kg',
        phase: 'Single Phase',
        pcb_area_size: 'Standard',
        driver_area_size: 'Compact',
      }
    }
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value,
    });
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [name]: type === 'number' ? parseInt(value) : value,
      } as ProductSpecifications
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSpecSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [name]: value,
      } as ProductSpecifications
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setImageFiles([...imageFiles, newFile]);
      
      try {
        setUploading(true);
        
        // Upload image to Supabase Storage
        const filePath = `product_images/${Date.now()}_${newFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, newFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error('Failed to get public URL for uploaded image');
        }
        
        // Add the image URL to the form data
        const imageUrl = publicUrlData.publicUrl;
        setFormData({
          ...formData,
          images: [...(formData.images || []), imageUrl],
        });
        
        toast({
          title: "Image uploaded successfully",
          description: "The image has been uploaded to the database.",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Upload failed",
          description: "There was a problem uploading the image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleModelFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setModelFile(file);
      
      try {
        setUploading(true);
        
        // Upload model to Supabase Storage
        const filePath = `models/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL for the uploaded model
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error('Failed to get public URL for uploaded model');
        }
        
        // Add the model URL to the form data
        const modelUrl = publicUrlData.publicUrl;
        setFormData({
          ...formData,
          model_url: modelUrl,
        });
        
        toast({
          title: "3D Model uploaded successfully",
          description: "The 3D model has been uploaded to the database.",
        });
      } catch (error) {
        console.error('Error uploading 3D model:', error);
        toast({
          title: "Upload failed",
          description: "There was a problem uploading the 3D model. Please try again.",
          variant: "destructive"
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddImageUrl = async () => {
    if (imageUrl && imageUrl.trim()) {
      try {
        setUploading(true);
        
        // Validate that the URL points to an image
        const response = await fetch(imageUrl.trim());
        if (!response.ok || !response.headers.get('content-type')?.includes('image')) {
          throw new Error('The provided URL does not point to a valid image');
        }
        
        setFormData({
          ...formData,
          images: [...(formData.images || []), imageUrl.trim()],
        });
        
        setImageUrl('');
        toast({
          title: "Image URL added",
          description: "The external image URL has been added to the product.",
        });
      } catch (error) {
        console.error('Error adding image URL:', error);
        toast({
          title: "Failed to add image URL",
          description: "Please make sure the URL points to a valid image and is accessible.",
          variant: "destructive"
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...(formData.images || [])];
    const removedImageUrl = updatedImages[index];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages.length > 0 ? updatedImages : [],
    });

    // If the image is stored in Supabase Storage, remove it
    if (removedImageUrl && removedImageUrl.includes('supabase')) {
      try {
        // Extract the file path from the URL
        const path = removedImageUrl.split('/').slice(-2).join('/');
        supabase.storage
          .from('products')
          .remove([path])
          .then(({ error }) => {
            if (error) {
              console.error('Error removing image from storage:', error);
            }
          });
      } catch (error) {
        console.error('Error parsing path for image removal:', error);
      }
    }

    // Also remove from imageFiles if present
    if (index < imageFiles.length) {
      const updatedFiles = [...imageFiles];
      updatedFiles.splice(index, 1);
      setImageFiles(updatedFiles);
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
    
    // Submit the form data
    onSubmit(formData);
  };

  // Create storage bucket if it doesn't exist
  React.useEffect(() => {
    const createBucketIfNotExists = async () => {
      try {
        const { data, error } = await supabase.storage.getBucket('products');
        
        if (error && error.message.includes('not found')) {
          // Bucket doesn't exist, create it
          const { error: createError } = await supabase.storage.createBucket('products', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'model/gltf-binary']
          });
          
          if (createError) {
            console.error('Error creating storage bucket:', createError);
          }
        } else if (error) {
          console.error('Error checking storage bucket:', error);
        }
      } catch (error) {
        console.error('Error setting up storage:', error);
      }
    };
    
    createBucketIfNotExists();
  }, []);

  return (
    <Card className="w-full dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-white">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wattage" className="dark:text-white">Wattage *</Label>
              <Input
                id="wattage"
                name="wattage"
                type="number"
                min="1"
                value={formData.wattage}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shape" className="dark:text-white">Shape *</Label>
              <Select
                value={formData.shape}
                onValueChange={(value) => handleSelectChange('shape', value)}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700">
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Square">Square</SelectItem>
                  <SelectItem value="Rectangular">Rectangular</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="material" className="dark:text-white">Material *</Label>
              <Select
                value={formData.material}
                onValueChange={(value) => handleSelectChange('material', value)}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700">
                  <SelectItem value="Aluminum">Aluminum</SelectItem>
                  <SelectItem value="Plastic">Plastic</SelectItem>
                  <SelectItem value="Steel">Steel</SelectItem>
                  <SelectItem value="Composite">Composite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color" className="dark:text-white">Color *</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price" className="dark:text-white">Price</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="₹150"
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-white">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="dark:text-white">Product Images</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.images && formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="h-20 w-20 border rounded overflow-hidden dark:border-gray-600">
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
                <Label htmlFor="image" className="dark:text-white">Upload Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="dark:bg-gray-700 dark:text-white"
                />
                {uploading && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Uploading...</p>}
              </div>
              
              <div>
                <Label htmlFor="imageUrl" className="dark:text-white">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={uploading}
                    className="dark:bg-gray-700 dark:text-white"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddImageUrl}
                    disabled={uploading}
                    className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="dark:text-white">3D Model (optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modelFile" className="dark:text-white">Upload 3D Model (.glb)</Label>
                <Input
                  id="modelFile"
                  name="modelFile"
                  type="file"
                  accept=".glb"
                  onChange={handleModelFileChange}
                  disabled={uploading}
                  className="dark:bg-gray-700 dark:text-white"
                />
                {uploading && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Uploading...</p>}
              </div>
              
              <div>
                <Label htmlFor="model_url" className="dark:text-white">3D Model URL (.glb)</Label>
                <Input
                  id="model_url"
                  name="model_url"
                  value={formData.model_url || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/model.glb"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            {formData.model_url && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                3D model set: {formData.model_url}
              </p>
            )}
          </div>

          <div className="pt-4 border-t dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_order_quantity" className="dark:text-white">Minimum Order Quantity</Label>
                <Input
                  id="min_order_quantity"
                  name="min_order_quantity"
                  type="number"
                  min="1"
                  value={formData.specifications?.min_order_quantity}
                  onChange={handleSpecChange}
                  placeholder="E.g., 50"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usage_application" className="dark:text-white">Usage/Application</Label>
                <Input
                  id="usage_application"
                  name="usage_application"
                  value={formData.specifications?.usage_application}
                  onChange={handleSpecChange}
                  placeholder="E.g., Indoor/Outdoor Lighting"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="dark:text-white">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.specifications?.brand}
                  onChange={handleSpecChange}
                  placeholder="E.g., Manisha Enterprises"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="beam_angle" className="dark:text-white">Beam Angle</Label>
                <Input
                  id="beam_angle"
                  name="beam_angle"
                  value={formData.specifications?.beam_angle}
                  onChange={handleSpecChange}
                  placeholder="E.g., 120°"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ip_rating" className="dark:text-white">IP Rating</Label>
                <Input
                  id="ip_rating"
                  name="ip_rating"
                  value={formData.specifications?.ip_rating}
                  onChange={handleSpecChange}
                  placeholder="E.g., IP65"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lighting_type" className="dark:text-white">Lighting Type</Label>
                <Input
                  id="lighting_type"
                  name="lighting_type"
                  value={formData.specifications?.lighting_type}
                  onChange={handleSpecChange}
                  placeholder="E.g., LED"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input_voltage" className="dark:text-white">Input Voltage</Label>
                <Input
                  id="input_voltage"
                  name="input_voltage"
                  value={formData.specifications?.input_voltage}
                  onChange={handleSpecChange}
                  placeholder="E.g., 220-240V AC"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency" className="dark:text-white">Frequency</Label>
                <Input
                  id="frequency"
                  name="frequency"
                  value={formData.specifications?.frequency}
                  onChange={handleSpecChange}
                  placeholder="E.g., 50-60Hz"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_weight" className="dark:text-white">Item Weight</Label>
                <Input
                  id="item_weight"
                  name="item_weight"
                  value={formData.specifications?.item_weight}
                  onChange={handleSpecChange}
                  placeholder="E.g., 0.5kg"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phase" className="dark:text-white">Phase</Label>
                <Input
                  id="phase"
                  name="phase"
                  value={formData.specifications?.phase}
                  onChange={handleSpecChange}
                  placeholder="E.g., Single Phase"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pcb_area_size" className="dark:text-white">PCB Area Size</Label>
                <Input
                  id="pcb_area_size"
                  name="pcb_area_size"
                  value={formData.specifications?.pcb_area_size}
                  onChange={handleSpecChange}
                  placeholder="E.g., Standard"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver_area_size" className="dark:text-white">Driver Area Size</Label>
                <Input
                  id="driver_area_size"
                  name="driver_area_size"
                  value={formData.specifications?.driver_area_size}
                  onChange={handleSpecChange}
                  placeholder="E.g., Compact"
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel} className="dark:text-white">
            Cancel
          </Button>
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            {product ? 'Update Product' : 'Save Product'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
