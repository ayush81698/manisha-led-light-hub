
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { products, Product, inquiries } from '@/data/products';
import { toast } from '@/components/ui/use-toast';
import ProductForm from '@/components/admin/ProductForm';

const AdminDashboard = () => {
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [inquiriesList, setInquiriesList] = useState(inquiries);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  const handleStatusChange = (inquiryId: string, newStatus: string) => {
    setInquiriesList(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId ? {...inquiry, status: newStatus} : inquiry
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Inquiry status changed to ${newStatus}`,
    });
  };
  
  const handleToggleProductStatus = (productId: string) => {
    setProductsList(prev => 
      prev.map(product => 
        product.id === productId ? {...product, isActive: !product.isActive} : product
      )
    );
    
    const product = productsList.find(p => p.id === productId);
    const newStatus = product?.isActive ? 'inactive' : 'active';
    
    toast({
      title: "Status Updated",
      description: `Product is now ${newStatus}`,
    });
  };
  
  const handleProductSubmit = (productData: Partial<Product>) => {
    if (currentProduct) {
      // Update existing product
      setProductsList(prev => 
        prev.map(product => 
          product.id === currentProduct.id ? { ...product, ...productData } : product
        )
      );
      
      setIsEditProductOpen(false);
      setCurrentProduct(null);
      
      toast({
        title: "Product Updated",
        description: `${productData.name} has been updated successfully`,
      });
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name || 'New Product',
        description: productData.description || 'No description',
        wattage: productData.wattage || 5,
        shape: productData.shape || 'Round',
        material: productData.material || 'Aluminum',
        color: productData.color || 'Silver',
        image: productData.image || '/placeholder.svg',
        isActive: true,
      };
      
      setProductsList(prev => [...prev, newProduct]);
      setIsNewProductOpen(false);
      
      toast({
        title: "Product Created",
        description: `${newProduct.name} has been added successfully`,
      });
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
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Admin</span>
            <Link to="/">
              <Button variant="ghost" size="sm">
                View Site
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{productsList.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {productsList.filter(p => p.isActive).length} active products
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inquiriesList.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {inquiriesList.filter(i => i.status === 'New').length} new inquiries
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Actions Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inquiriesList.filter(i => i.status === 'New').length}</div>
              <p className="text-xs text-gray-500 mt-1">
                Pending inquiries to review
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Products and Inquiries */}
        <Tabs defaultValue="inquiries">
          <TabsList className="mb-6">
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Customer Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiriesList.map((inquiry) => (
                        <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">{inquiry.productName}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{inquiry.quantity}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{inquiry.phone}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{inquiry.date}</td>
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
                              >
                                Mark Called
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(inquiry.id, 'Ignored')}
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Button size="sm" onClick={() => setIsNewProductOpen(true)}>Add New Product</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wattage</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shape</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.image}
                                  alt={product.name}
                                />
                              </div>
                              <div className="max-w-xs">
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-gray-500 text-sm truncate">{product.description.substring(0, 60)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">{product.wattage}W</td>
                          <td className="px-4 py-4 whitespace-nowrap">{product.shape}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{product.material}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleProductStatus(product.id)}
                              >
                                {product.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditProduct(product)}
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
      
      {/* New Product Sheet */}
      <Sheet open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
        <SheetContent side="right" className="w-full md:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <ProductForm
              onSubmit={handleProductSubmit}
              onCancel={() => setIsNewProductOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Edit Product Sheet */}
      <Sheet open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <SheetContent side="right" className="w-full md:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
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
