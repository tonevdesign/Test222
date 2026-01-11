export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Zekto',
  description: 'Открийте широка гама от висококачествени продукти на най-добри цени.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  links: {
    github: '#',
    twitter: '#',
    instagram: '#',
  },
  nav: [
    {
      title: 'Zekto',
      href: '/products',
    },
  ],
  footer: {
    customer: {
      title: 'Обслужване на клиенти',
      items: [
        { title: 'Доставка', href: '/shipping' },
        { title: 'Връщане', href: '/returns' },
      ],
    },
    legal: {
      title: 'Правна информация',
      items: [
        { title: 'Поверителност', href: '/privacy' },
        { title: 'Условия', href: '/terms' },
        { title: 'Бисквитки', href: '/cookies' },
      ],
    },
  },
};