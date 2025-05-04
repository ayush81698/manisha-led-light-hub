
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
}

export async function loginAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    console.log("Attempting login with:", email);
    
    // Query the admin_users table for the provided email
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, password')
      .eq('email', email)
      .single();
    
    if (adminError) {
      console.error('Error during admin login query:', adminError);
      return null;
    }
    
    // If no matching admin user found, return null
    if (!adminData) {
      console.log("No matching admin user found");
      return null;
    }
    
    // Check if password matches (simple string comparison for now)
    if (adminData.password !== password) {
      console.log("Password doesn't match");
      return null;
    }
    
    console.log("Admin login successful:", adminData.email);
    
    // Return admin user without the password
    const { password: _, ...adminUser } = adminData;
    return adminUser as AdminUser;
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
