import { ProductUsage } from '@/features/business/inventory-usage'

export const metadata = {
  title: 'Product Usage',
  description: 'Track product consumption and costs',
}

export default async function ProductUsagePage() {
  return <ProductUsage />
}
