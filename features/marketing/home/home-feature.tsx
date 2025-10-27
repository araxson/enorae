import {
  StructuredData,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo'

import { HomePage } from './home-page'

export function MarketingHomeFeature() {
  return (
    <>
      <StructuredData
        data={[generateOrganizationSchema(), generateWebSiteSchema()]}
      />
      <HomePage />
    </>
  )
}
