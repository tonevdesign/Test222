import { cookies } from 'next/headers';

/**
 * Get auth token from cookies (server-side)
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('accessToken')?.value || null;
  } catch {
    return null;
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  return userRole === requiredRole;
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole: string): boolean => {
  return userRole === 'admin';
};

/**
 * Check if user is customer
 */
export const isCustomer = (userRole: string): boolean => {
  return userRole === 'customer';
};