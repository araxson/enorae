import { APP_DESCRIPTION, APP_NAME, APP_URL } from '@/lib/constants/app.constants'
import type { StructuredDataProps } from './schema-types'

export function generateOrganizationSchema(): StructuredDataProps {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/enorae',
      'https://instagram.com/enorae',
      'https://linkedin.com/company/enorae',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@enorae.com',
      telephone: '+1-800-ENORAE',
      contactType: 'Customer Service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
  }
}
