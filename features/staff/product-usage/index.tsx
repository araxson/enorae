import { Section, Stack } from '@/components/layout'
import { ProductUsageList } from './components/product-usage-list'
import { getMyProductUsage } from './api/queries'
import type { ProductUsage } from './types'

interface ProductUsageFeatureProps {
  productUsage: ProductUsage[]
}

export function ProductUsageFeature({ productUsage }: ProductUsageFeatureProps) {
  return (
    <Stack gap="lg">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Product Usage History</h1>
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
