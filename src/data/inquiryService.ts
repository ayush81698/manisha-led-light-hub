
import { supabase } from '@/integrations/supabase/client';

export async function fetchInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select(`
      *,
      products(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }

  return data.map(inquiry => ({
    id: inquiry.id,
    productName: inquiry.products?.name || 'Unknown Product',
    quantity: inquiry.quantity,
    phone: inquiry.phone,
    date: new Date(inquiry.created_at).toLocaleDateString(),
    status: inquiry.status
  }));
}

export async function saveInquiry(productId: string, quantity: number, phone: string) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      product_id: productId,
      quantity,
      phone,
      status: 'New'
    })
    .select();

  if (error) {
    console.error('Error saving inquiry:', error);
    return null;
  }

  return data[0];
}

export async function updateInquiryStatus(inquiryId: string, status: string) {
  const { error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', inquiryId);

  if (error) {
    console.error('Error updating inquiry status:', error);
    return false;
  }

  return true;
}
