import type { StructuredDataProps } from './schema-types'

/**
 * Sanitize JSON-LD data to prevent XSS attacks
 * Escapes characters that could break out of script tags
 */
function sanitizeJsonLd(data: unknown): string {
  const jsonString = JSON.stringify(data)

  // CRITICAL SECURITY: Escape characters that could be used for XSS
  // Replace < > & to prevent breaking out of script context
  return jsonString
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

export function StructuredData({ data }: { data: StructuredDataProps | StructuredDataProps[] }) {
  const jsonLd = Array.isArray(data) ? data : [data]

  return jsonLd.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(item) }}
    />
  ))
}
