import { ReferralProgram } from '@/features/customer/referrals'

export const metadata = {
  title: 'Referral Program',
  description: 'Refer friends and earn bonus points for every successful signup',
}

export default async function ReferralsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <ReferralProgram />
    </div>
  )
}
