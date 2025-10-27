import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getStaffProfile } from './api/queries'
import { StaffProfileDetail } from './components/staff-profile-detail'
import { Spinner } from '@/components/ui/spinner'

export async function StaffProfilePage({ staffId }: { staffId: string }) {
  const profile = await getStaffProfile(staffId)

  if (!profile) {
    notFound()
  }

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <StaffProfileDetail profile={profile} />
    </section>
  )
}

export async function StaffProfileFeature({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolved = await params

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      }
    >
      <StaffProfilePage staffId={resolved.id} />
    </Suspense>
  )
}

export { getStaffProfile, getSalonStaff } from './api/queries'
export type { StaffProfile } from './api/queries'
