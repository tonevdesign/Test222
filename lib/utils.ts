/**
 * Format price as currency (BGN)
 */
export const formatPrice = (price: string | number): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generate slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (
  originalPrice: string | number,
  salePrice: string | number
): number => {
  const orig = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const sale = typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice;
  return Math.round(((orig - sale) / orig) * 100);
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('bg-BG');
};

/**
 * Get initials from user name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, length: number): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};