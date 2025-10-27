import { Suspense } from 'react'

import { getLoyaltyPoints, getLoyaltyTransactions } from './api/queries'
import { LoyaltyDashboard } from './components/loyalty-dashboard'

import { generateMetadata as genMeta } from '@/lib/metadata'
import { Spinner } from '@/components/ui/spinner'

export const loyaltyMetadata = genMeta({

  title: 'Loyalty Rewards',
  description: 'Earn points with every visit and redeem them for exclusive rewards',
})

export async function LoyaltyProgram() {
  const points = await getLoyaltyPoints()
  const transactions = await getLoyaltyTransactions()

  return (
    <div className="mx-auto w-full px-6 max-w-6xl pb-16 pt-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Loyalty Rewards</h1>
          <p className="leading-7 text-muted-foreground">
            Earn points with every visit and redeem them for exclusive rewards
          </p>
        </div>

        <LoyaltyDashboard points={points} transactions={transactions} />
      </div>
    </div>
  )
}

export function LoyaltyProgramFeature() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      }
    >
      <LoyaltyProgram />
    </Suspense>
  )
}
