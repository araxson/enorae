import { Suspense } from 'react'

import { getReferralCode, getReferralStats, getReferralHistory } from './api/queries'
import { ReferralDashboard } from './components/referral-dashboard'

import { Spinner } from '@/components/ui/spinner'

export async function ReferralProgram() {

  const referralCode = await getReferralCode()
  const stats = await getReferralStats()
  const history = await getReferralHistory()

  return (
    <div className="mx-auto w-full px-6 max-w-6xl pb-16 pt-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-extrabold lg:text-5xl">Referral Program</h1>
          <p className="text-muted-foreground">
            Refer friends and earn bonus points for every successful signup
          </p>
        </div>

        <ReferralDashboard
          referralCode={referralCode}
          stats={stats}
          history={history}
        />
      </div>
    </div>
  )
}

export function ReferralProgramFeature() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      }
    >
      <ReferralProgram />
    </Suspense>
  )
}
