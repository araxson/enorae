import { ProductUsage } from '@/features/product-usage'
import { getProductUsage } from '@/features/product-usage/dal/product-usage.queries'

export const metadata = {
  title: 'Product Usage',
  description: 'Track product consumption and costs',
}

export default async function ProductUsagePage() {
  const usage = await getProductUsage()
  return <ProductUsage initialUsage={usage} />
}
