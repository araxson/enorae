import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getCurrentUserMetadata } from '@/features/shared/profile-metadata/api/queries'
import { getProfile, getUserAppointments } from './api/queries'
import { CustomerProfileContent, CustomerProfileAuthError } from './components'

export const customerProfileMetadata = genMeta({
  title: 'My Profile',
  description: 'Manage your profile and view your appointment history.',
  noIndex: true,
})

async function CustomerProfile() {
  try {
    const [profile, appointments, metadata] = await Promise.all([
      getProfile(),
      getUserAppointments(),
      getCurrentUserMetadata(),
    ])

    return <CustomerProfileContent profile={profile} appointments={appointments} metadata={metadata} />
  } catch {
    return <CustomerProfileAuthError />
  }
}

export function CustomerProfileFeature() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Spinner /></div>}>
      <CustomerProfile />
    </Suspense>
  )
}
export type * from './api/types'
