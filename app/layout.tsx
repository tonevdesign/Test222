import type { Metadata } from 'next';
import { apiClient } from '@/lib/api';
import { Category } from '@/types/product';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/providers/AuthProvider';
import CartProvider from '@/components/providers/CartProvider';
import NotificationToast from '@/components/notifications/NotificationToast';
import { defaultMetadata, organizationSchema, websiteSchema } from '@/config/seo';
import './globals.css';

export const revalidate = 300;

export const metadata: Metadata = defaultMetadata;

async function fetchCategories() {
  try {
    const response = await apiClient.get<Category[]>('/categories?show_in_menu=true');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await fetchCategories();

  return (
    <html lang="bg" data-scroll-behavior="smooth">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Favicons / PWA */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00BFA6" />
        <meta name="msapplication-TileColor" content="#00BFA6" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
        <meta name="theme-color" content="#00BFA6" />
      </head>
      <body className="bg-white">
        <AuthProvider>
          <CartProvider>
            <Header categories={categories} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <NotificationToast />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}