import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { Container, Stack } from '@/components/layout'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getLoyaltyPoints, getLoyaltyTransactions } from './api/queries'
import { LoyaltyDashboard } from './components/loyalty-dashboard'

export const loyaltyMetadata = genMeta({
  title: 'Loyalty Rewards',
  description: 'Earn points with every visit and redeem them for exclusive rewards',
})

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

export function LoyaltyProgramFeature() {
  return (
    <Suspense fallback={<PageLoading />}>
      <LoyaltyProgram />
    </Suspense>
  )
}
