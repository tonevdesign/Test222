export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive';
  email_verified?: boolean;
  createdAt?: string;
  addresses?: Address[];
}

export interface Address {
  id: number;
  user_id: number;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string | null;
  is_default: boolean;
  type: 'shipping' | 'billing' | 'both';
  created_at: string;
  updated_at: string;
}