import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
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
          <H1>Profile Management</H1>
          <P className="text-muted-foreground">
            Search, review, and manage user identities, metadata, and privacy controls.
          </P>
        </div>

        <ProfileManagementClient
          initialProfiles={initialProfiles}
          initialProfile={initialProfile}
        />
      </Stack>
    </Section>
  )
}
