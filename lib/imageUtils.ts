/**
 * Get the full image URL from backend
 * Handles both absolute URLs and relative paths
 */
/**
 * Build a full URL for images stored on the backend.
 * Automatically removes /api from the env var since static files are served from /uploads.
 */
export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return '/placeholder.png';

  // Remove `/api` suffix from NEXT_PUBLIC_API_URL (for image routes)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || '';

  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Clean up accidental `/api/` prefix in the path
  const cleanedPath = imagePath.replace(/^\/?api\//, '');

  // Ensure it starts with /uploads/ (avoid duplicating when path already begins with uploads)
  const hasUploadsPrefix =
    cleanedPath.startsWith('/uploads') || cleanedPath.startsWith('uploads/');

  const normalizedPath = hasUploadsPrefix
    ? cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`
    : `/uploads/${cleanedPath.replace(/^\/+/, '')}`;

  // Return the full URL
  return `${baseUrl}${normalizedPath}`;
};


/**
 * Get thumbnail image URL (if available)
 */
export const getThumbnailUrl = (thumbnailPath?: string): string => {
  if (!thumbnailPath) {
    return '/images/placeholder-thumb.png';
  }

  if (thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://')) {
    return thumbnailPath;
  }

  if (thumbnailPath.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_API_URL}${thumbnailPath}`;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${thumbnailPath}`;
};

/**
 * Get image with fallback
 * Returns thumbnail if available, otherwise returns full image
 */
export const getOptimizedImageUrl = (
  imagePath?: string,
  thumbnailPath?: string
): string => {
  if (thumbnailPath) {
    return getThumbnailUrl(thumbnailPath);
  }
  return getImageUrl(imagePath);
};

/**
 * Image sizes for Next.js Image component
 * Used for responsive image optimization
 */
export const productImageSizes =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw';

export const categoryImageSizes =
  '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

export const heroImageSizes =
  '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw';

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (imagePath: string): string => {
  const url = getImageUrl(imagePath);
  return `${url}?w=320 320w, ${url}?w=640 640w, ${url}?w=1024 1024w, ${url}?w=1280 1280w`;
};

/**
 * Validate if image URL is valid
 */
export const isValidImageUrl = (url?: string): boolean => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};