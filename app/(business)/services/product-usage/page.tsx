import { ServiceProductUsage } from '@/features/service-product-usage'
import { getServiceProductUsage } from '@/features/service-product-usage/dal/service-product-usage.queries'

export const metadata = {
  title: 'Service Product Usage',
  description: 'Map products to services for cost tracking',
}

export default async function ServiceProductUsagePage() {
  const usage = await getServiceProductUsage()
  return <ServiceProductUsage initialUsage={usage} />
}
