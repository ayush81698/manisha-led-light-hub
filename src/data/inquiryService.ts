
import { supabase } from '@/integrations/supabase/client';

export async function fetchInquiries() {
  try {
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
      productName: inquiry.products?.name || 'General Inquiry',
      quantity: inquiry.quantity,
      phone: inquiry.phone,
      date: new Date(inquiry.created_at).toLocaleDateString(),
      status: inquiry.status,
      notes: inquiry.notes
    }));
  } catch (error) {
    console.error('Exception fetching inquiries:', error);
    return [];
  }
}

export async function saveInquiry(productId: string | null, quantity: number, phone: string, notes?: string) {
  try {
    console.log("Saving inquiry with data:", { productId, quantity, phone, notes });
    
    // For general inquiries, set a default UUID instead of null
    const generalInquiryId = '00000000-0000-0000-0000-000000000000';
    const actualProductId = productId || generalInquiryId;
    
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        product_id: actualProductId,
        quantity,
        phone,
        notes,
        status: 'New'
      })
      .select();

    if (error) {
      console.error('Error saving inquiry:', error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Exception saving inquiry:', error);
    return null;
  }
}

export async function updateInquiryStatus(inquiryId: string, status: string) {
  try {
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', inquiryId);

    if (error) {
      console.error('Error updating inquiry status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating inquiry status:', error);
    return false;
  }
}
