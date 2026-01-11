import { Bundle } from '@/types/bundle';
import { CartItem, BundleCartProduct } from '@/types/cart';

const formatNumberString = (value: number | string): string => {
  const numeric = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00';
};

export const createBundleCartItem = (
  bundle: Bundle,
  imagePath?: string
): CartItem => {
  const pricing = bundle.bundle_pricing;

  if (!pricing) {
    throw new Error('Bundle pricing information is missing.');
  }

  const bundleItems: BundleCartProduct[] =
    bundle.bundleItems?.map((item) => {
      const product = item.bundledProduct;
      const variant = product?.variants?.[0];
      const productImage = product?.images?.[0];

      return {
        product_id: product?.id ?? item.bundled_product_id,
        variant_id: variant?.id ?? null,
        product_name: product?.name || 'Product',
        product_slug: product?.slug,
        image_url: productImage?.thumbnail_url || productImage?.image_url,
        unit_price: variant?.price,
        quantity: item.quantity,
      };
    }) || [];

  const unitPrice = formatNumberString(pricing.bundle_price);

  return {
    id: Date.now(),
    product_id: bundle.id,
    variant_id: null,
    product_name: bundle.name,
    product_slug: undefined,
    variant_name: 'Bundle',
    quantity: 1,
    unit_price: unitPrice,
    total_amount: unitPrice,
    image_url: imagePath || '',
    is_bundle: true,
    bundle_id: bundle.id,
    bundle_name: bundle.name,
    bundle_slug: bundle.slug ?? undefined,
    bundle_original_price: formatNumberString(pricing.original_price),
    bundle_savings_amount: formatNumberString(pricing.savings),
    bundle_savings_percentage: pricing.savings_percentage,
    bundle_items: bundleItems,
  };
};

