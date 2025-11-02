import { Spinner } from '@/components/ui/spinner'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { Suspense } from 'react'
import { ReferralDashboard } from './components'
import { getReferralCode, getReferralHistory, getReferralStats } from './api/queries'

export async function ReferralProgram() {

  const referralCode = await getReferralCode()
  const stats = await getReferralStats()
  const history = await getReferralHistory()

  return (
    <div className="mx-auto w-full px-6 max-w-6xl pb-16 pt-6">
      <div className="flex flex-col gap-8">
        <ItemGroup className="gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Referral Program</ItemTitle>
              <ItemDescription>
                Refer friends and earn bonus points for every successful signup
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <ReferralDashboard
          referralCode={referralCode ?? null}
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
