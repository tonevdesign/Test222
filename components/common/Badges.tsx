import React from 'react';
import { Badge } from '@/components/ui/badge';
import { calculateDiscount } from '@/lib/utils';

interface ProductBadgesProps {
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: string | number;
  salePrice?: string | number;
}

export function ProductBadges({
  isFeatured,
  isNew,
  isSale,
  originalPrice,
  salePrice,
}: ProductBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {isNew && (
        <Badge variant="success" size="sm">
          New
        </Badge>
      )}

      {isFeatured && (
        <Badge variant="primary" size="sm">
          Featured
        </Badge>
      )}

      {isSale && originalPrice && salePrice && (
        <Badge
          variant="danger"
          size="sm"
          style={{ backgroundColor: '#00FFD1', color: '#1F1F1F' }}
        >
          -
          {calculateDiscount(originalPrice, salePrice)}%
        </Badge>
      )}
    </div>
  );
}