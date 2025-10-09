import type { StructuredDataProps } from './schema-types'

export function StructuredData({ data }: { data: StructuredDataProps | StructuredDataProps[] }) {
  const jsonLd = Array.isArray(data) ? data : [data]

  return jsonLd.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
    />
  ))
}
