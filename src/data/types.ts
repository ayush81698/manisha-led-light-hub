
// Product-related interfaces
export interface ProductSpecifications {
  id?: string;
  min_order_quantity?: number;
  usage_application?: string;
  brand?: string;
  beam_angle?: string;
  power?: string;
  ip_rating?: string;
  body_material?: string;
  lighting_type?: string;
  input_voltage?: string;
  frequency?: string;
  item_weight?: string;
  phase?: string;
  pcb_area_size?: string;
  driver_area_size?: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  wattage: number;
  shape: 'Round' | 'Square' | 'Rectangular' | 'Custom';
  material: string;
  color: string;
  is_active: boolean;
  specifications_id?: string;
  specifications?: ProductSpecifications;
  images?: string[];
  price?: string;
  image_url?: string;
  model_url?: string;
}

// Mock data interfaces
export interface InquiryMock {
  id: string;
  productName: string;
  quantity: number;
  phone: string;
  date: string;
  status: string;
}
