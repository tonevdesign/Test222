export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      me: '/auth/me',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    products: {
      list: '/products',
      detail: (slug: string) => `/products/${slug}`,
    },
    categories: {
      list: '/categories',
      detail: (slug: string) => `/categories/${slug}`,
    },
    brands: {
      list: '/brands',
    },
    search: {
      products: '/search/products',
      suggestions: '/search/suggestions',
      filters: '/search/filters',
      popular: '/search/popular',
    },
    cart: {
      get: '/cart',
      add: '/cart',
      update: '/cart/:id',
      remove: '/cart/:id',
    },
    orders: {
      list: '/orders',
      create: '/orders',
      detail: (id: number) => `/orders/${id}`,
      stats: '/orders/stats',
    },
    users: {
      addresses: '/users/addresses',
      orders: '/users/orders',
      profile: '/users/profile',
    },
    wishlist: {
      default: '/wishlist/default',
      check: (productId: number) => `/wishlist/check/${productId}`,
      add: '/wishlist',
      remove: '/wishlist/:id',
    },
    shipping: {
      methods: '/shipping/methods',
      calculate: '/shipping/calculate',
    },
    sales: {
      products: '/sales/products',
    },
  },
};