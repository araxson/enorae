import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { LoyaltyProgram } from '@/features/customer/loyalty'

export const metadata = {
  title: 'Loyalty Rewards',
  description: 'Earn points with every visit and redeem them for exclusive rewards',
}

export default function LoyaltyProgramPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <LoyaltyProgram />
    </Suspense>
  )
}
