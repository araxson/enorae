import { getReferralCode, getReferralStats, getReferralHistory } from './api/queries'
import { ReferralDashboard } from './components/referral-dashboard'
import { Container, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function ReferralProgram() {
  const referralCode = await getReferralCode()
  const stats = await getReferralStats()
  const history = await getReferralHistory()

  return (
    <Container size="lg" className="pb-16 pt-6">
      <Stack gap="xl">
        <div>
          <H1>Referral Program</H1>
          <P className="text-muted-foreground">
            Refer friends and earn bonus points for every successful signup
          </P>
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
