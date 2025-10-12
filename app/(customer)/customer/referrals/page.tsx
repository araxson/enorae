import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { ReferralProgram } from '@/features/customer/referrals'

export const metadata = {
  title: 'Referral Program',
  description: 'Refer friends and earn bonus points for every successful signup',
}

export default function ReferralProgramPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ReferralProgram />
    </Suspense>
  )
}
