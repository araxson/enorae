import { ServiceProductUsage } from '@/features/shared/service-product-usage'

export const metadata = {
  title: 'Service Product Usage',
  description: 'Map products to services for cost tracking',
}

export default async function ServiceProductUsagePage() {
  return <ServiceProductUsage />
}
