import { getLoyaltyPoints, getLoyaltyTransactions } from './api/queries'
import { LoyaltyDashboard } from './components/loyalty-dashboard'
import { Container, Stack } from '@/components/layout'

export async function LoyaltyProgram() {
  const points = await getLoyaltyPoints()
  const transactions = await getLoyaltyTransactions()

  return (
    <Container size="lg" className="pb-16 pt-6">
      <Stack gap="xl">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Loyalty Rewards</h1>
          <p className="leading-7 text-muted-foreground">
            Earn points with every visit and redeem them for exclusive rewards
          </p>
        </div>

        <LoyaltyDashboard points={points} transactions={transactions} />
      </Stack>
    </Container>
  )
}
