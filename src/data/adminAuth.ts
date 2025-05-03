
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    // First check if the admin user exists with the provided credentials
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', email)
      .eq('password', password)
      .single();
    
    if (error) {
      console.error('Error during admin login:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return data as AdminUser;
  } catch (error) {
    console.error('Exception during admin login:', error);
    return null;
  }
}

export function saveAdminSession(admin: AdminUser) {
  localStorage.setItem('adminUser', JSON.stringify(admin));
}

export function getAdminSession(): AdminUser | null {
  const adminJson = localStorage.getItem('adminUser');
  if (adminJson) {
    try {
      return JSON.parse(adminJson) as AdminUser;
    } catch (error) {
      console.error('Error parsing admin session:', error);
      return null;
    }
  }
  return null;
}

export function clearAdminSession() {
  localStorage.removeItem('adminUser');
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}
