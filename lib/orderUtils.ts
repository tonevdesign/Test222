export const ORDER_STATUSES = {
  processing: 'Обработва се',
  sent: 'Изпратена',
  cancelled: 'Отказана',
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

export const getStatusLabel = (status: string): string => {
  return ORDER_STATUSES[status as OrderStatus] || status;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'sent':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};