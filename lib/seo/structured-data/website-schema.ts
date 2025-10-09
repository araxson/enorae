import { APP_DESCRIPTION, APP_NAME, APP_URL } from '@/lib/constants/app.constants'
import type { StructuredDataProps } from './schema-types'

export function generateWebSiteSchema(): StructuredDataProps {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
