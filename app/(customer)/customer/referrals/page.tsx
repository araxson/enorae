import { ReferralProgramFeature } from '@/features/customer/referrals'

export const metadata = {
  title: 'Referral Program',
  description: 'Refer friends and earn bonus points for every successful signup',
}

export default function Page() {
  return <ReferralProgramFeature />
}
