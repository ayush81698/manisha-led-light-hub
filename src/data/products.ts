
// Re-export all functionality from the new modules for backward compatibility
import { supabase } from '@/integrations/supabase/client';

// Export types
export type { 
  Product, 
  ProductSpecifications 
} from './types';

// Export mock data
export { 
  productsMock, 
  inquiriesMock 
} from './mocks';

// Export storage functions
export { 
  ensureStorageBucketExists 
} from './storage';

// Export product functions
export { 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  toggleProductStatus 
} from './productService';

// Export inquiry functions
export { 
  fetchInquiries, 
  saveInquiry, 
  updateInquiryStatus 
} from './inquiryService';

// Helper function to ensure shape values match our union type (exported for backward compatibility)
export function mapShapeValue(shape: string): 'Round' | 'Square' | 'Rectangular' | 'Custom' {
  switch (shape) {
    case 'Round':
      return 'Round';
    case 'Square':
      return 'Square';
    case 'Rectangular':
      return 'Rectangular';
    default:
      return 'Custom';
  }
}
