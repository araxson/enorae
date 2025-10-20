import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { Container, Stack } from '@/components/layout'
import { getReferralCode, getReferralStats, getReferralHistory } from './api/queries'
import { ReferralDashboard } from './components/referral-dashboard'

export async function ReferralProgram() {
  const referralCode = await getReferralCode()
  const stats = await getReferralStats()
  const history = await getReferralHistory()

  return (
    <Container size="lg" className="pb-16 pt-6">
      <Stack gap="xl">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Referral Program</h1>
          <p className="leading-7 text-muted-foreground">
            Refer friends and earn bonus points for every successful signup
          </p>
        </div>

        <ReferralDashboard
          referralCode={referralCode}
          stats={stats}
          history={history}
        />
      </Stack>
    </Container>
  )
}

export function ReferralProgramFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ReferralProgram />
    </Suspense>
  )
}
