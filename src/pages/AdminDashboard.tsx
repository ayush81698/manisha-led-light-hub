
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Product, fetchProducts, fetchInquiries, updateProduct, addProduct, toggleProductStatus, updateInquiryStatus } from '@/data/products';
import { toast } from '@/components/ui/use-toast';
import ProductForm from '@/components/admin/ProductForm';
import HeroSettings from '@/components/admin/HeroSettings';
import FeaturedSettings from '@/components/admin/FeaturedSettings';

const AdminDashboard = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    loadProducts();
    loadInquiries();
  }, []);
  
  const loadProducts = async () => {
    const products = await fetchProducts();
    setProductsList(products);
  };
  
  const loadInquiries = async () => {
    const inquiries = await fetchInquiries();
    setInquiriesList(inquiries);
  };
  
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    const success = await updateInquiryStatus(inquiryId, newStatus);
    
    if (success) {
      // Update local state
      setInquiriesList(prev => 
        prev.map(inquiry => 
          inquiry.id === inquiryId ? {...inquiry, status: newStatus} : inquiry
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Inquiry status changed to ${newStatus}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleProductStatus = async (productId: string) => {
    const product = productsList.find(p => p.id === productId);
    if (!product) return;
    
    const newStatus = !product.is_active;
    
    await toggleProductStatus(productId, newStatus);
    
    // Update local state
    setProductsList(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, is_active: newStatus } : p
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Product is now ${newStatus ? 'active' : 'inactive'}`,
    });
  };
  
  const handleProductSubmit = async (productData: Partial<Product>) => {
    if (currentProduct) {
      const updatedProduct = { ...currentProduct, ...productData } as Product;
      const result = await updateProduct(updatedProduct);
      
      if (result) {
        // Refresh products list
        await loadProducts();
        
        setIsEditProductOpen(false);
        setCurrentProduct(null);
        
        toast({
          title: "Product Updated",
          description: `${productData.name} has been updated successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive"
        });
      }
    } else {
      const newProduct: Product = {
        name: productData.name || 'New Product',
        description: productData.description || 'No description',
        wattage: productData.wattage || 5,
        shape: productData.shape || 'Round',
        material: productData.material || 'Aluminum',
        color: productData.color || 'Silver',
        images: productData.images || ['/placeholder.svg'],
        is_active: true,
        price: productData.price || '',
        specifications: productData.specifications
      };
      
      const result = await addProduct(newProduct);
      
      if (result) {
        // Refresh products list
        await loadProducts();
        
        setIsNewProductOpen(false);
        
        toast({
          title: "Product Created",
          description: `${newProduct.name} has been added successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create product",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditProductOpen(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Called':
        return 'bg-green-100 text-green-800';
      case 'Ignored':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary dark:text-yellow-500">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300">Welcome, Admin</span>
            <Link to="/">
              <Button variant="ghost" size="sm" className="dark:text-white">
                View Site
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm" className="dark:text-white">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white">{productsList.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {productsList.filter(p => p.is_active).length} active products
              </p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white">{inquiriesList.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {inquiriesList.filter(i => i.status === 'New').length} new inquiries
              </p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-white">{inquiriesList.filter(i => i.status === 'New').length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Pending inquiries to review
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="hero">
          <TabsList className="mb-6 dark:bg-gray-700">
            <TabsTrigger value="hero" className="dark:text-gray-300 dark:data-[state=active]:text-white">Hero Section</TabsTrigger>
            <TabsTrigger value="featured" className="dark:text-gray-300 dark:data-[state=active]:text-white">Featured Products Section</TabsTrigger>
            <TabsTrigger value="inquiries" className="dark:text-gray-300 dark:data-[state=active]:text-white">Inquiries</TabsTrigger>
            <TabsTrigger value="products" className="dark:text-gray-300 dark:data-[state=active]:text-white">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero">
            <HeroSettings />
          </TabsContent>
          
          <TabsContent value="featured">
            <FeaturedSettings />
          </TabsContent>
          
          <TabsContent value="inquiries">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Customer Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiriesList.map((inquiry) => (
                        <tr key={inquiry.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap dark:text-white">{inquiry.productName}</td>
                          <td className="px-4 py-4 whitespace-nowrap dark:text-white">{inquiry.quantity}</td>
                          <td className="px-4 py-4 whitespace-nowrap dark:text-white">{inquiry.phone}</td>
                          <td className="px-4 py-4 whitespace-nowrap dark:text-white">{inquiry.date}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(inquiry.id, 'Called')}
                                className="dark:text-white dark:border-gray-600"
                              >
                                Mark Called
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(inquiry.id, 'Ignored')}
                                className="dark:text-white dark:border-gray-600"
                              >
                                Ignore
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="dark:text-white">Product Management</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setIsNewProductOpen(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Add New Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wattage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shape</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Material</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map((product) => (
                        <tr key={product.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={(product.images && product.images.length > 0) ? product.images[0] : (product.image_url || '/placeholder.svg')}
                                  alt={product.name}
                                />
                              </div>
                              <div className="max-w-xs">
                                <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm truncate">
                                  {product.description.substring(0, 60)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap dark:text-white">{product.wattage}W</td>
                          <td className="px-4 py-4 whitespace-nowrap dark:text-white">{product.shape}</td>
                          <td className="px-4 py-4 whitespace-nowrap dark:text-white">{product.material}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleProductStatus(product.id || '')}
                                className="dark:text-white dark:border-gray-600"
                              >
                                {product.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditProduct(product)}
                                className="dark:text-white dark:border-gray-600"
                              >
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Sheet open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
        <SheetContent side="right" className="w-full md:max-w-xl overflow-y-auto dark:bg-gray-800 dark:text-white">
          <SheetHeader>
            <SheetTitle className="dark:text-white">Add New Product</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <ProductForm
              onSubmit={handleProductSubmit}
              onCancel={() => setIsNewProductOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <Sheet open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <SheetContent side="right" className="w-full md:max-w-xl overflow-y-auto dark:bg-gray-800 dark:text-white">
          <SheetHeader>
            <SheetTitle className="dark:text-white">Edit Product</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {currentProduct && (
              <ProductForm
                product={currentProduct}
                onSubmit={handleProductSubmit}
                onCancel={() => {
                  setIsEditProductOpen(false);
                  setCurrentProduct(null);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;
