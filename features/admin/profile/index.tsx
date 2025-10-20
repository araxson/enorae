import { Section, Stack } from '@/components/layout'
import { ProfileManagementClient } from './components/profile-management-client'
import { searchProfiles, getProfileDetail } from './api/queries'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

export async function AdminProfile() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const initialProfiles = await searchProfiles('', 25)
  const initialProfile =
    initialProfiles.length > 0 ? await getProfileDetail(initialProfiles[0].id) : null

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Profile Management</h1>
          <p className="leading-7 text-muted-foreground">
            Search, review, and manage user identities, metadata, and privacy controls.
          </p>
        </div>

        <ProfileManagementClient
          initialProfiles={initialProfiles}
          initialProfile={initialProfile}
        />
      </Stack>
    </Section>
  )
}
