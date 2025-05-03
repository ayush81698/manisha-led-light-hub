
import { Product, InquiryMock } from './types';

// Mock data for initial loading - will be replaced with DB data
export const productsMock: Product[] = [
  {
    id: '1',
    name: '5W Round Housing',
    description: 'Premium 5W round LED housing with aluminum finish.',
    wattage: 5,
    shape: 'Round',
    material: 'Aluminum',
    color: 'Silver',
    is_active: true,
    images: ['/placeholder.svg'],
    price: '₹150'
  },
  {
    id: '2',
    name: '10W Square Housing',
    description: 'Durable 10W square LED housing for commercial applications.',
    wattage: 10,
    shape: 'Square',
    material: 'Plastic',
    color: 'White',
    is_active: true,
    images: ['/placeholder.svg'],
    price: '₹250'
  },
  {
    id: '3',
    name: '24W Street Light Housing',
    description: 'Heavy-duty 24W LED housing for outdoor street lighting.',
    wattage: 24,
    shape: 'Rectangular',
    material: 'Aluminum',
    color: 'Black',
    is_active: true,
    images: ['/placeholder.svg'],
    price: '₹400'
  }
];

// Mock inquiries data
export const inquiriesMock: InquiryMock[] = [
  {
    id: '1',
    productName: '5W Round Housing',
    quantity: 100,
    phone: '+919876543210',
    date: '2023-05-01',
    status: 'New'
  },
  {
    id: '2',
    productName: '10W Square Housing',
    quantity: 50,
    phone: '+919876543211',
    date: '2023-05-02',
    status: 'Called'
  },
  {
    id: '3',
    productName: '24W Street Light Housing',
    quantity: 25,
    phone: '+919876543212',
    date: '2023-05-03',
    status: 'Ignored'
  }
];
