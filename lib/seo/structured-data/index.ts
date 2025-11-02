/**
 * SEO Structured Data Schemas
 *
 * JSON-LD schema generators for rich search results.
 * All structured data imports should use @/lib/seo/structured-data
 */

// Schema generators
export { generateBreadcrumbSchema } from './breadcrumb-schema'
export { generateFAQSchema } from './faq-schema'
export { generateLocalBusinessSchema } from './local-business-schema'
export { generateOrganizationSchema } from './organization-schema'
export { generateReviewSchema } from './review-schema'
export { generateServiceSchema } from './service-schema'
export { generateWebSiteSchema } from './website-schema'

// Types
export type { StructuredDataProps } from './schema-types'
export type { SalonSchemaInput } from './local-business-schema'

// Component
export { StructuredData } from './component'
