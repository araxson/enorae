import { ProductUsageList } from './components/product-usage-list'
import { getMyProductUsage } from './api/queries'
import type { ProductUsage } from './types'

interface ProductUsageFeatureProps {
  productUsage: ProductUsage[]
}

export function ProductUsageFeature({ productUsage }: ProductUsageFeatureProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Product Usage History</h1>
      <ProductUsageList productUsage={productUsage} />
    </div>
  )
}

export async function StaffProductUsagePage() {
  const productUsage = await getMyProductUsage()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ProductUsageFeature productUsage={productUsage} />
    </section>
  )
}
