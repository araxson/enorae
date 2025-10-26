import { APP_URL } from '@/lib/constants'
import { SEO_CONSTANTS } from '@/lib/config/constants'
import type { StructuredDataProps } from './schema-types'

export type SalonSchemaInput = {
  name: string
  description: string
  address?: string
  phone?: string
  image?: string
  rating?: number
  reviewCount?: number
  priceRange?: string
}

export function generateLocalBusinessSchema(salon: SalonSchemaInput): StructuredDataProps {
  const schema: StructuredDataProps = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: salon['name'],
    description: salon['description'],
    image: salon.image || `${APP_URL}${SEO_CONSTANTS.DEFAULT_SALON_IMAGE}`,
    priceRange: salon.priceRange || SEO_CONSTANTS.DEFAULT_PRICE_RANGE,
  }

  if (salon['address']) {
    schema['address'] = {
      '@type': 'PostalAddress',
      streetAddress: salon['address'],
    }
  }

  if (salon['phone']) {
    schema['telephone'] = salon['phone']
  }

  if (salon['rating'] && salon.reviewCount) {
    schema['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: salon['rating'],
      reviewCount: salon.reviewCount,
      bestRating: SEO_CONSTANTS.RATING_SCALE.best,
      worstRating: SEO_CONSTANTS.RATING_SCALE.worst,
    }
  }

  return schema
}
