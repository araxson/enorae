import type { Metadata } from 'next'
import { APP_DESCRIPTION } from '@/lib/constants/app.constants'
import { defaultMetadata } from './default-metadata'

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
    keywords: [...(defaultMetadata.keywords as string[]), ...keywords],
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
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : defaultMetadata.robots,
  }
}
