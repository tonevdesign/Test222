'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const calculateTotal = useCartStore((state) => state.calculateTotal);

  useEffect(() => {
    // Wait for Zustand to rehydrate from localStorage
    setIsHydrated(true);
    
    // Recalculate total after hydration to ensure accuracy
    calculateTotal();
  }, [calculateTotal]);

  // Prevent hydration mismatch by not rendering children until hydrated
  if (!isHydrated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}