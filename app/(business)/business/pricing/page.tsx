import { DynamicPricing } from '@/features/business/pricing'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Dynamic Pricing',
  description: 'Configure automated pricing strategies and adjustments',
  noIndex: true,
})

export default async function PricingPage() {
  return <DynamicPricing />
}
