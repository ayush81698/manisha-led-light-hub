
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState({
    wattageRange: [0, 50],
    shapes: [] as string[],
    materials: [] as string[]
  });
  
  // Extract unique shape and material values
  const uniqueShapes = Array.from(new Set(products.map(p => p.shape)));
  const uniqueMaterials = Array.from(new Set(products.map(p => p.material)));
  
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
    
    // Filter by wattage range
    result = result.filter(p => 
      p.wattage >= filters.wattageRange[0] && 
      p.wattage <= filters.wattageRange[1]
    );
    
    // Filter by shapes
    if (filters.shapes.length > 0) {
      result = result.filter(p => filters.shapes.includes(p.shape));
    }
    
    // Filter by materials
    if (filters.materials.length > 0) {
      result = result.filter(p => filters.materials.includes(p.material));
    }
    
    setFilteredProducts(result);
  };
  
  const resetFilters = () => {
    setFilters({
      wattageRange: [0, 50],
      shapes: [],
      materials: []
    });
    setFilteredProducts(products);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
        <p className="text-lg text-gray-600">Explore our range of premium LED light housings</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Wattage</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 50]}
                  max={50}
                  step={1}
                  value={filters.wattageRange}
                  onValueChange={handleWattageChange}
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>{filters.wattageRange[0]}W</span>
                  <span>{filters.wattageRange[1]}W</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Shape</h4>
              <div className="space-y-2">
                {uniqueShapes.map(shape => (
                  <div key={shape} className="flex items-center">
                    <Checkbox 
                      id={`shape-${shape}`} 
                      checked={filters.shapes.includes(shape)}
                      onCheckedChange={() => handleShapeToggle(shape)}
                    />
                    <Label 
                      htmlFor={`shape-${shape}`}
                      className="ml-2 text-sm font-normal"
                    >
                      {shape}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium mb-2">Material</h4>
              <div className="space-y-2">
                {uniqueMaterials.map(material => (
                  <div key={material} className="flex items-center">
                    <Checkbox 
                      id={`material-${material}`} 
                      checked={filters.materials.includes(material)}
                      onCheckedChange={() => handleMaterialToggle(material)}
                    />
                    <Label 
                      htmlFor={`material-${material}`}
                      className="ml-2 text-sm font-normal"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">Apply</Button>
              <Button onClick={resetFilters} variant="outline" className="flex-1">Reset</Button>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
              <Button onClick={resetFilters} variant="outline" className="mt-4">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-40 w-auto object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-medium">{product.wattage}W</span>
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
