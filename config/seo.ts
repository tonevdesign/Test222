import { Metadata } from 'next';

export const seoConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Zekto',
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  defaultTitle: 'Zekto.bg',
  defaultDescription: 'Открийте широка гама от висококачествени продукти на най-добри цени.',
  defaultKeywords: [
    'онлайн магазин',
    'качествени продукти',
    'безплатна доставка',
    'България',
    'онлайн пазаруване'
  ],
  ogImage: '/og-image.jpg',
  twitterHandle: '@yourstore',
  locale: 'bg_BG',
  type: 'website',
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.defaultDescription,
  keywords: seoConfig.defaultKeywords,
  authors: [{ name: seoConfig.siteName }],
  creator: seoConfig.siteName,
  publisher: seoConfig.siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: seoConfig.locale,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [
      {
        url: seoConfig.ogImage,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [seoConfig.ogImage],
    creator: seoConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// Structured data for Organization
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: seoConfig.siteName,
  url: seoConfig.siteUrl,
  logo: `${seoConfig.siteUrl}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+359-87-834-6659',
    contactType: 'Customer Service',
    areaServed: 'BG',
    availableLanguage: ['Bulgarian'],
  },
  sameAs: [
    'https://www.facebook.com/yourstore',
    'https://www.instagram.com/yourstore',
    'https://twitter.com/yourstore',
  ],
};

// Website structured data
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: seoConfig.siteName,
  url: seoConfig.siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${seoConfig.siteUrl}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Helper function to generate page metadata
export function generatePageMetadata({
  title,
  description,
  keywords,
  ogImage,
  noIndex = false,
  canonical,
}: {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}): Metadata {
  return {
    title,
    description: description || seoConfig.defaultDescription,
    keywords: keywords || seoConfig.defaultKeywords,
    openGraph: {
      title,
      description: description || seoConfig.defaultDescription,
      url: canonical || seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      images: ogImage ? [{ url: ogImage }] : [{ url: seoConfig.ogImage }],
      locale: seoConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || seoConfig.defaultDescription,
      images: ogImage ? [ogImage] : [seoConfig.ogImage],
    },
    alternates: canonical ? { canonical } : undefined,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}