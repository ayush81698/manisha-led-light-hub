import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, Product } from '@/data/products';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import FlipProductCard from '@/components/products/FlipProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import { HamsterLoader } from '@/components/ui/hamster-loader';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    wattageRange: [0, 50],
    shapes: [] as string[],
    materials: [] as string[]
  });
  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data.filter(p => p.is_active));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const handleWattageChange = (value: number[]) => {
    setFilters({ ...filters, wattageRange: value });
  };
  
  const handleShapeToggle = (shape: string) => {
    setFilters(prev => {
      const newShapes = prev.shapes.includes(shape)
        ? prev.shapes.filter(s => s !== shape)
        : [...prev.shapes, shape];
      
      return { ...prev, shapes: newShapes };
    });
  };
  
  const handleMaterialToggle = (material: string) => {
    setFilters(prev => {
      const newMaterials = prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material];
      
      return { ...prev, materials: newMaterials };
    });
  };
  
  const applyFilters = () => {
    let result = products;
    
    result = result.filter(p => 
      p.wattage >= filters.wattageRange[0] && 
      p.wattage <= filters.wattageRange[1]
    );
    
    if (filters.shapes.length > 0) {
      result = result.filter(p => filters.shapes.includes(p.shape));
    }
    
    if (filters.materials.length > 0) {
      result = result.filter(p => filters.materials.includes(p.material));
    }
    
    result = result.filter(p => p.is_active);
    
    setFilteredProducts(result);
  };
  
  const resetFilters = () => {
    setFilters({
      wattageRange: [0, 50],
      shapes: [],
      materials: []
    });
    setFilteredProducts(products.filter(p => p.is_active));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };
  
  if (loading) {
    return <HamsterLoader fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Product Catalog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Explore our range of premium LED light housings</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Filters</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2 dark:text-white">Wattage</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 50]}
                  max={50}
                  step={1}
                  value={filters.wattageRange}
                  onValueChange={handleWattageChange}
                  className="my-6"
                />
                <div className="flex justify-between text-sm dark:text-gray-300">
                  <span>{filters.wattageRange[0]}W</span>
                  <span>{filters.wattageRange[1]}W</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2 dark:text-white">Shape</h4>
              <div className="space-y-2">
                {uniqueShapes.map((shape) => (
                  <div key={shape} className="flex items-center">
                    <Checkbox 
                      id={`shape-${shape}`} 
                      checked={filters.shapes.includes(shape)}
                      onCheckedChange={() => handleShapeToggle(shape)}
                    />
                    <Label 
                      htmlFor={`shape-${shape}`}
                      className="ml-2 text-sm font-normal dark:text-gray-300"
                    >
                      {shape}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2 dark:text-white">Material</h4>
              <div className="space-y-2">
                {uniqueMaterials.map((material) => (
                  <div key={material} className="flex items-center">
                    <Checkbox 
                      id={`material-${material}`} 
                      checked={filters.materials.includes(material)}
                      onCheckedChange={() => handleMaterialToggle(material)}
                    />
                    <Label 
                      htmlFor={`material-${material}`}
                      className="ml-2 text-sm font-normal dark:text-gray-300"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white">Apply</Button>
              <Button onClick={resetFilters} variant="outline" className="flex-1 dark:text-white">Reset</Button>
            </div>
          </div>
        </div>
        
        <div className="lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">No products found</h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters</p>
              <Button onClick={resetFilters} variant="outline" className="mt-4 dark:text-white">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <FlipProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default ProductCatalog;
