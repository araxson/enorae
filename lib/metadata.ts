/**
 * Metadata Configuration
 *
 * Centralized metadata configuration for SEO and social sharing.
 * Use these helpers to generate consistent metadata across all pages.
 */

import type { Metadata } from 'next'
import { APP_NAME, APP_DESCRIPTION, APP_URL } from './constants'

/**
 * Default metadata for the application
 */
export const defaultMetadata: Metadata = {
  title: {
    default: `${APP_NAME} - Modern Salon Booking Platform`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'salon booking',
    'beauty appointments',
    'hair salon',
    'spa booking',
    'beauty services',
    'online booking',
    'salon management',
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Modern Salon Booking Platform`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@enorae',
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
}

/**
 * Generate page metadata
 *
 * @param options - Page-specific metadata options
 * @returns Metadata object for the page
 *
 * @example
 * export const metadata = generateMetadata({
 *   title: 'Browse Salons',
 *   description: 'Discover the best salons in your area',
 * })
 */
export function generateMetadata(options: {
  title: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
}): Metadata {
  const {
    title,
    description = APP_DESCRIPTION,
    keywords = [],
    image = '/og-image.png',
    noIndex = false,
  } = options

  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords as string[], ...keywords],
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : defaultMetadata.robots,
  }
}

/**
 * Generate metadata for dynamic pages (e.g., salon detail)
 *
 * @param options - Dynamic page metadata options
 * @returns Metadata object for the dynamic page
 *
 * @example
 * export async function generateMetadata({ params }: Props): Promise<Metadata> {
 *   const salon = await getSalon(params.slug)
 *   return generateDynamicMetadata({
 *     title: salon.name,
 *     description: salon.description,
 *     image: salon.image,
 *   })
 * }
 */
export function generateDynamicMetadata(options: {
  title: string
  description: string
  image?: string
  keywords?: string[]
}): Metadata {
  const {
    title,
    description,
    image = '/og-image.png',
    keywords = [],
  } = options

  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords as string[], ...keywords],
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
