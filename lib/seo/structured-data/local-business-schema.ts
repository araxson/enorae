import { APP_URL } from '@/lib/constants/app.constants'
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
    name: salon.name,
    description: salon.description,
    image: salon.image || `${APP_URL}/default-salon.png`,
    priceRange: salon.priceRange || '$$',
  }

  if (salon.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: salon.address,
    }
  }

  if (salon.phone) {
    schema.telephone = salon.phone
  }

  if (salon.rating && salon.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: salon.rating,
      reviewCount: salon.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}
