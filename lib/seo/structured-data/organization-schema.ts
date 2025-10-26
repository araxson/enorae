import { APP_DESCRIPTION, APP_NAME, APP_URL } from '@/lib/constants'
import { PLATFORM_SOCIAL_URLS, PLATFORM_CONTACT } from '@/lib/config/constants'
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
      PLATFORM_SOCIAL_URLS.twitter,
      PLATFORM_SOCIAL_URLS.instagram,
      PLATFORM_SOCIAL_URLS.linkedin,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: PLATFORM_CONTACT.support,
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
