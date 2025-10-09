import type { StructuredDataProps } from './schema-types'

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): StructuredDataProps {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
