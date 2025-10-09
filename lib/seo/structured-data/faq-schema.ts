import type { StructuredDataProps } from './schema-types'

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): StructuredDataProps {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
