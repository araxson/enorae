import { CustomerAnalyticsFeature, customerAnalyticsMetadata } from '@/features/customer/analytics'

export const metadata = customerAnalyticsMetadata

export default function Page() {
  return <CustomerAnalyticsFeature />
}
