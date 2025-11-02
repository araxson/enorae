import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getLoyaltyPoints, getLoyaltyTransactions } from './api/queries'
import { LoyaltyDashboard } from './components'

export const loyaltyMetadata = genMeta({
  title: 'Loyalty Rewards',
  description: 'Earn points with every visit and redeem them for exclusive rewards',
})

async function LoyaltyProgram() {
  const points = await getLoyaltyPoints()
  const transactions = await getLoyaltyTransactions()

  return (
    <div className="mx-auto w-full px-6 max-w-6xl pb-16 pt-6">
      <div className="flex flex-col gap-8">
        <ItemGroup className="gap-2">
          <Item variant="muted" className="flex-col items-start gap-2">
            <ItemContent>
              <ItemTitle>Loyalty Rewards</ItemTitle>
              <ItemDescription>
                Earn points with every visit and redeem them for exclusive rewards
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <LoyaltyDashboard points={points} transactions={transactions} />
      </div>
    </div>
  )
}

export function LoyaltyProgramFeature() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner /></div>}>
      <LoyaltyProgram />
    </Suspense>
  )
}
export * from './types'
