import { Section, Stack } from '@/components/layout'
import { H1 } from '@/components/ui/typography'
import { ProductUsageList } from './components/product-usage-list'
import { getMyProductUsage } from './api/queries'
import type { ProductUsage } from './types'

interface ProductUsageFeatureProps {
  productUsage: ProductUsage[]
}

export function ProductUsageFeature({ productUsage }: ProductUsageFeatureProps) {
  return (
    <Stack gap="lg">
      <H1>Product Usage History</H1>
      <ProductUsageList productUsage={productUsage} />
    </Stack>
  )
}

export async function StaffProductUsagePage() {
  const productUsage = await getMyProductUsage()

  return (
    <Section size="lg">
      <ProductUsageFeature productUsage={productUsage} />
    </Section>
  )
}
