import { LoyaltyProgram } from '@/features/customer/loyalty'

export const metadata = {
  title: 'Loyalty Rewards',
  description: 'Earn points with every visit and redeem them for exclusive rewards',
}

export default async function LoyaltyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <LoyaltyProgram />
    </div>
  )
}
