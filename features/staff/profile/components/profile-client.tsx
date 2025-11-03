'use client'

import { Edit } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSidebar } from './profile-sidebar'
import { ProfileViewTab } from './profile-view-tab'
import { ProfileEditTab } from './profile-edit-tab'
import type { Database } from '@/lib/types/database.types'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/staff-common'

type StaffProfile = Database['public']['Views']['staff_enriched_view']['Row']
type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row'] | null

type ProfileClientProps = {
  profile: StaffProfile
  metadata: ProfileMetadata
  username: string | null
}

export function ProfileClient({ profile, metadata, username }: ProfileClientProps) {
  const summaries: StaffSummary[] = [
    {
      id: 'experience',
      label: 'Experience',
      value: profile.experience_years ? `${profile.experience_years} yrs` : '—',
      helper: 'Professional experience',
      tone: 'info',
    },
  ]

  const quickActions: StaffQuickAction[] = [
    { id: 'schedule', label: 'Manage schedule', href: '/staff/schedule' },
    { id: 'time-off', label: 'Request time off', href: '/staff/time-off' },
    { id: 'services', label: 'Update services', href: '/staff/services' },
  ]

  return (
    <StaffPageShell
      title="Profile"
      description={profile.title || 'Manage your personal information and preferences.'}
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Profile' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:h-full">
          <ProfileSidebar profile={profile} metadata={metadata} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="view" className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View profile</TabsTrigger>
              <TabsTrigger value="edit">
                <span className="flex items-center gap-2">
                  <Edit className="size-4" aria-hidden="true" />
                  Edit profile
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4">
              <ProfileViewTab profile={profile} metadata={metadata} />
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <ProfileEditTab profile={profile} metadata={metadata} username={username} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StaffPageShell>
  )
}
