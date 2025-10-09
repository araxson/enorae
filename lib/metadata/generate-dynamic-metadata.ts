import type { Metadata } from 'next'
import { defaultMetadata } from './default-metadata'

export function generateDynamicMetadata(options: {
  title: string
  description: string
  image?: string
  keywords?: string[]
}): Metadata {
  const { title, description, image = '/og-image.png', keywords = [] } = options

  return {
    title,
    description,
    keywords: [...(defaultMetadata.keywords as string[]), ...keywords],
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
