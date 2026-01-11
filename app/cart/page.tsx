import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import CartContent from '@/components/cart/CartContent';

export const metadata: Metadata = {
  title: 'Количка | Zekto',
  description: 'Прегледайте продуктите във вашата количка',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={[{ label: 'Количка' }]} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CartContent />
      </div>
    </div>
  );
}
