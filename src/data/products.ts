
export interface Product {
  id: string;
  name: string;
  description: string;
  wattage: number;
  shape: 'Round' | 'Square' | 'Rectangular' | 'Custom';
  material: string;
  color: string;
  images: string[]; // Changed from image to images array
  price?: string;
  isActive: boolean;
}

// Create a singleton instance for products state management
class ProductsStore {
  private static instance: ProductsStore;
  private _products: Product[] = [
    {
      id: '1',
      name: 'Round LED Housing (5W)',
      description: 'High-durability housing ideal for surface mounting. Lightweight and UV resistant.',
      wattage: 5,
      shape: 'Round',
      material: 'Polycarbonate',
      color: 'White',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    },
    {
      id: '2',
      name: 'Square Housing (6W)',
      description: 'Sleek housing with easy mount design. Durable for indoor applications.',
      wattage: 6,
      shape: 'Square',
      material: 'Plastic body with metal ring',
      color: 'White',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    },
    {
      id: '3',
      name: 'Street Light Casing (24W)',
      description: 'Aluminum die-cast street light enclosure. Strong heat dissipation.',
      wattage: 24,
      shape: 'Rectangular',
      material: 'Aluminum',
      color: 'Grey',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    },
    {
      id: '4',
      name: 'Round Ceiling Light Housing (12W)',
      description: 'Flush mount ceiling housing with heat sink design. Easy installation clips.',
      wattage: 12,
      shape: 'Round',
      material: 'Polycarbonate with Aluminum',
      color: 'White',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    },
    {
      id: '5',
      name: 'Square Panel Housing (18W)',
      description: 'Premium grade panel light housing with uniform light distribution design.',
      wattage: 18,
      shape: 'Square',
      material: 'Aluminum frame with acrylic diffuser',
      color: 'Silver',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    },
    {
      id: '6',
      name: 'Spot Light Housing (8W)',
      description: 'Adjustable spotlight housing with directional beam capability.',
      wattage: 8,
      shape: 'Round',
      material: 'Metal',
      color: 'Black',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    },
    {
      id: '7',
      name: 'Outdoor Flood Light Case (30W)',
      description: 'Weatherproof housing for outdoor flood applications. IP65 rated design.',
      wattage: 30,
      shape: 'Rectangular',
      material: 'Die-cast Aluminum',
      color: 'Dark Grey',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    },
    {
      id: '8',
      name: 'Slim Panel Housing (15W)',
      description: 'Ultra-thin panel light housing for modern ceiling installations.',
      wattage: 15,
      shape: 'Square',
      material: 'Aluminum with PC diffuser',
      color: 'White',
      images: ['/placeholder.svg'],
      price: 'Contact for price',
      isActive: true
    }
  ];

  private constructor() {}

  public static getInstance(): ProductsStore {
    if (!ProductsStore.instance) {
      ProductsStore.instance = new ProductsStore();
    }
    return ProductsStore.instance;
  }

  getProducts(): Product[] {
    return this._products;
  }

  updateProduct(updatedProduct: Product): void {
    this._products = this._products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    );
  }

  addProduct(newProduct: Product): void {
    this._products.push(newProduct);
  }

  toggleProductStatus(productId: string): void {
    this._products = this._products.map(product => 
      product.id === productId ? {...product, isActive: !product.isActive} : product
    );
  }
}

// Export the products singleton instance
const productsStore = ProductsStore.getInstance();
export const products = productsStore.getProducts();
export const updateProduct = (product: Product) => productsStore.updateProduct(product);
export const addProduct = (product: Product) => productsStore.addProduct(product);
export const toggleProductStatus = (productId: string) => productsStore.toggleProductStatus(productId);

export const inquiries = [
  {
    id: '1',
    productId: '1',
    productName: 'Round LED Housing (5W)',
    quantity: 250,
    phone: '+91-9876543210',
    date: '2025-04-15',
    status: 'New'
  },
  {
    id: '2',
    productId: '3',
    productName: 'Street Light Casing (24W)',
    quantity: 100,
    phone: '+91-9876543211',
    date: '2025-04-14',
    status: 'Called'
  },
  {
    id: '3',
    productId: '5',
    productName: 'Square Panel Housing (18W)',
    quantity: 500,
    phone: '+91-9876543212',
    date: '2025-04-10',
    status: 'Ignored'
  }
];
