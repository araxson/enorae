import { generateMetadata as genMeta } from '@/lib/metadata'
import {
  StructuredData,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/structured-data'
import { HomePageClient } from './components/home-page-client'

export function HomePage() {
  return <HomePageClient />
}

export const marketingHomeMetadata = genMeta({
  title: 'Home - Modern Salon Booking Platform',
  description: 'Book appointments at the best salons. Discover beauty services, spas, and hair salons in your area.',
  keywords: ['salon booking', 'beauty appointments', 'hair salon near me', 'spa booking'],
})

export function MarketingHomeFeature() {
  return (
    <>
      <StructuredData data={[generateOrganizationSchema(), generateWebSiteSchema()]} />
      <HomePage />
    </>
  )
}

export * from './api/queries'
export * from './api/mutations'
