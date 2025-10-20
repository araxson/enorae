import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/business/',
          '/staff/',
          '/admin/',
          '/api/',
          '/profile/',
          '/book/',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
