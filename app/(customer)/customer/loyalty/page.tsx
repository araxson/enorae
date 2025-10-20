import { LoyaltyProgramFeature, loyaltyMetadata } from '@/features/customer/loyalty'

export const metadata = loyaltyMetadata

export default function Page() {
  return <LoyaltyProgramFeature />
}
