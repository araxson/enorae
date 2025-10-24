import { ProfileManagementClient } from './components/profile-management-client'
import { searchProfiles, getProfileDetail } from './api/queries'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function AdminProfile() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const initialProfiles = await searchProfiles('', 25)
  const initialProfile =
    initialProfiles.length > 0 ? await getProfileDetail(initialProfiles[0].id) : null

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold">Profile Management</h1>
            <p className="text-muted-foreground">
              Search, review, and manage user identities, metadata, and privacy controls.
            </p>
          </div>

          <ProfileManagementClient
            initialProfiles={initialProfiles}
            initialProfile={initialProfile}
          />
        </div>
      </div>
    </section>
  )
}
