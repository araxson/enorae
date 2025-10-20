import { CustomerProfileFeature, customerProfileMetadata } from '@/features/customer/profile'

export const metadata = customerProfileMetadata

export default function Page() {
  return <CustomerProfileFeature />
}
