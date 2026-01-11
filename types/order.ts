export type OrderStatus = 'processing' | 'sent' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: string;
  regular_price?: string;
  sale_price?: string; 
  tax_amount: string;
  discount_amount: string;
  total_amount: string;

  bundle_id?: number;
  bundle_name?: string;
  
  variant?: {
    id: number;
    product?: {
      id: number;
      name: string;
      slug: string;
      description?: string;
      images?: Array<{
        id: number;
        image_url: string;
        thumbnail_url: string;
        is_primary: boolean;
      }>;
    };
  };
  
  created_at?: string;
  updated_at?: string;
}

export interface OrderStatusHistory {
  old_status: string | null;
  new_status: string;
  comment?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  guest_email?: string;
  status: OrderStatus;
  payment_status: string;
  subtotal: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  total_amount: string;
  notes?: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  user?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ShippingAddress {
  id: number;
  order_id: number;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}