import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { searchProfiles, getProfileDetail } from './api/queries'
import { ProfileManagementClient } from './components'

export async function AdminProfile() {
  await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)

  const initialProfiles = await searchProfiles('', 25)
  const firstProfile = initialProfiles[0]
  const initialProfile = firstProfile ? await getProfileDetail(firstProfile.id) : null

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <ItemGroup className="gap-2">
            <Item variant="muted" className="flex-col items-start gap-2">
              <ItemContent>
                <ItemTitle>Profile Management</ItemTitle>
                <ItemDescription>
                  Search, review, and manage user identities, metadata, and privacy controls.
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>

          <ProfileManagementClient
            initialProfiles={initialProfiles}
            initialProfile={initialProfile}
          />
        </div>
      </div>
    </section>
  )
}
export * from './api/types'
