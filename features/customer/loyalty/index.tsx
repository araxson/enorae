import { getLoyaltyPoints, getLoyaltyTransactions } from './api/queries'
import { LoyaltyDashboard } from './components/loyalty-dashboard'
import { Container, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function LoyaltyProgram() {
  const points = await getLoyaltyPoints()
  const transactions = await getLoyaltyTransactions()

  return (
    <Container size="lg" className="pb-16 pt-6">
      <Stack gap="xl">
        <div>
          <H1>Loyalty Rewards</H1>
          <P className="text-muted-foreground">
            Earn points with every visit and redeem them for exclusive rewards
          </P>
        </div>

        <LoyaltyDashboard points={points} transactions={transactions} />
      </Stack>
    </Container>
  )
}
