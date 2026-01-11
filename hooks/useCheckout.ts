'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { Address } from '@/types/user';
import { ShippingMethod } from '@/types/shipping';

const shippingSchema = z.object({
  guest_email: z.string().email('Моля въведете валиден имейл адрес'),
  first_name: z.string().min(2, 'Името е задължително'),
  last_name: z.string().min(2, 'Фамилията е задължителна'),
  address_line1: z.string().min(5, 'Адресът е задължителен'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'Градът е задължителен'),
  state: z.string().min(2, 'Областта е задължителна'),
  postal_code: z.string().min(3, 'Пощенският код е задължителен'),
  country: z.string().min(1),
  phone: z.string().min(10, 'Телефонният номер е задължителен'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

type CreateOrderResponse = {
  id: number;
  order_number: string;
  [key: string]: unknown;
};

export function useCheckout() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: 'България',
    },
  });

  const populateFormFromAddress = useCallback((address: Address) => {
    if (!user) return;

    form.reset({
      guest_email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || address.phone || '',
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
    });
  }, [user, form]);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;

    setIsLoadingAddresses(true);
    try {
      const response = await apiClient.get<Address[]>('/users/addresses');
      if (response.success && response.data) {
        setSavedAddresses(response.data);

        // Find default address or use first one
        const defaultAddress = response.data.find(addr => addr.is_default);
        const addressToUse = defaultAddress || response.data[0];

        if (addressToUse) {
          setSelectedAddressId(addressToUse.id);
          setUseNewAddress(false);
          populateFormFromAddress(addressToUse);
        } else {
          // No addresses saved
          setUseNewAddress(true);
          // Just populate user info
          form.reset({
            guest_email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'България',
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setUseNewAddress(true);
      // Populate at least user info on error
      if (user) {
        form.reset({
          guest_email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'България',
        });
      }
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user, form, populateFormFromAddress]);

  // Initialize checkout
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    if (user) {
      fetchAddresses();
    } else {
      // Guest user - just set useNewAddress
      setUseNewAddress(true);
    }

    fetchShippingMethods();
  }, [items, router, user, fetchAddresses]);

  const fetchShippingMethods = async () => {
    try {
      const response = await apiClient.get<ShippingMethod[]>('/shipping/methods');
      if (response.data) {
        setShippingMethods(response.data);
        if (response.data.length > 0) {
          setSelectedShipping(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error);
    }
  };

  const handleAddressSelect = (addressId: number) => {
    const address = savedAddresses.find(a => a.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setUseNewAddress(false);
      populateFormFromAddress(address);
    }
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setUseNewAddress(true);

    form.reset({
      guest_email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'България',
    });
  };

  const buildOrderItemsPayload = () => {
    type OrderItemPayload = {
      product_id: number;
      variant_id?: number | null;
      quantity: number;
      unit_price: string;
      regular_price?: string;
      sale_price?: string;
      variant_name?: string;
      is_bundle: boolean;
      bundle_id?: number;
      bundle_name?: string;
    };

    return items.reduce<OrderItemPayload[]>((acc, item) => {
      if (!item.is_bundle || !item.bundle_items?.length) {
        acc.push({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          regular_price: item.regular_price,
          sale_price: item.sale_price,
          variant_name: item.variant_name,
          is_bundle: false,
        });
        return acc;
      }

      const bundleBaseTotal = item.bundle_items.reduce((sum, bundleProduct) => {
        const basePrice = bundleProduct.unit_price
          ? parseFloat(bundleProduct.unit_price)
          : 0;
        return sum + basePrice * bundleProduct.quantity;
      }, 0);

      const targetBundlePrice = parseFloat(item.unit_price);
      const discountRatio =
        bundleBaseTotal > 0 ? targetBundlePrice / bundleBaseTotal : 1;

      const bundleItems = item.bundle_items
        .filter((bundleProduct) => bundleProduct.variant_id)
        .map((bundleProduct) => {
          const basePrice = bundleProduct.unit_price
            ? parseFloat(bundleProduct.unit_price)
            : 0;
          const adjustedUnitPrice = (basePrice * discountRatio).toFixed(2);

          return {
            product_id: bundleProduct.product_id,
            variant_id: bundleProduct.variant_id,
            quantity: bundleProduct.quantity * item.quantity,
            unit_price: adjustedUnitPrice,
            regular_price: bundleProduct.unit_price,
            sale_price: adjustedUnitPrice,
            variant_name: bundleProduct.variant_name,
            is_bundle: true,
            bundle_id: item.bundle_id,
            bundle_name: item.bundle_name,
          };
        });

      acc.push(...bundleItems);
      return acc;
    }, []);
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !selectedShipping) return;

    setIsSubmitting(true);

    try {
      const orderItemsPayload = buildOrderItemsPayload();

      if (orderItemsPayload.length === 0) {
        throw new Error('Няма артикули за поръчка.');
      }

      const orderData = {
        items: orderItemsPayload,
        shipping_address: {
          ...shippingData,
          country: 'България',
        },
        shipping_method_id: selectedShipping.id,
        payment_method: 'cash_on_delivery',
        guest_email: shippingData.guest_email,
      };

      const response = await apiClient.post<CreateOrderResponse>(
        '/orders',
        orderData
      );

      if (response.success && response.data) {
        const orderNumber = response.data.order_number;

        clearCart();

        const successUrl = orderNumber
          ? `/checkout/success?order=${orderNumber}`
          : '/checkout/success';

        window.location.href = successUrl;
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error: unknown) {
      console.error('Order failed:', error);

      let errorMessage = 'Неуспешна поръчка. Моля, опитайте отново.';

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const err = error as {
          response?: {
            message?: string;
            errors?: Record<string, string>;
          };
        };

        if (err.response?.message) {
          errorMessage = err.response.message;
        } else if (err.response?.errors) {
          errorMessage = Object.values(err.response.errors).join(', ');
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    shippingData,
    selectedShipping,
    shippingMethods,
    isSubmitting,
    savedAddresses,
    selectedAddressId,
    useNewAddress,
    isLoadingAddresses,
    items,
    total,
    user,
    form,
    setCurrentStep,
    setShippingData,
    setSelectedShipping,
    handleAddressSelect,
    handleUseNewAddress,
    handlePlaceOrder,
  };
}