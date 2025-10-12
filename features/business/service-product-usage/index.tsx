import { getServiceProductUsage } from './api/queries'
import { ServiceProductUsageClient } from './components/service-product-usage-client'

export async function ServiceProductUsage() {
  const usage = await getServiceProductUsage()
  return <ServiceProductUsageClient initialUsage={usage} />
}
