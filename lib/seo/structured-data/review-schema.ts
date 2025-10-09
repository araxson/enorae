import type { StructuredDataProps } from './schema-types'

export type ReviewSchemaInput = {
  author: string
  rating: number
  text: string
  datePublished: string
  itemReviewed: string
}

export function generateReviewSchema(review: ReviewSchemaInput): StructuredDataProps {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.datePublished,
    reviewBody: review.text,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      '@type': 'Thing',
      name: review.itemReviewed,
    },
  }
}
