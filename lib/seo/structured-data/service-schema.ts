import type { StructuredDataProps } from './schema-types'

export type ServiceSchemaInput = {
  name: string
  description: string
  provider: string
  price?: number
  currency?: string
}

export function generateServiceSchema(service: ServiceSchemaInput): StructuredDataProps {
  const schema: StructuredDataProps = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service['name'],
    description: service['description'],
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
  }

  if (service['price'] && service['currency']) {
    schema['offers'] = {
      '@type': 'Offer',
      price: service['price'],
      priceCurrency: service['currency'],
    }
  }

  return schema
}
