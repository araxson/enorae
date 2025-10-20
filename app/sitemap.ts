import type { MetadataRoute } from 'next'
import { APP_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()

  return [
    // Homepage
    {
      url: APP_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    // Main discovery page
    {
      url: `${APP_URL}/explore`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Marketing pages
    {
      url: `${APP_URL}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${APP_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${APP_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Legal pages
    {
      url: `${APP_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${APP_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Auth pages (lower priority, but still indexed)
    {
      url: `${APP_URL}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${APP_URL}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
