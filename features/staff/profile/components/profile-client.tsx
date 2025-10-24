'use client'

import { User, Briefcase, Edit } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StaffInfoForm } from './staff-info-form'
import { MetadataForm } from '@/features/shared/profile-metadata/components/metadata-form'
import { UsernameForm } from '@/features/shared/profile/components/username-form'
import { ProfilePhotoUpload } from './profile-photo-upload'
import { CertificationsEditor } from './certifications-editor'
import { SpecialtiesEditor } from './specialties-editor'
import { PortfolioGallery } from './portfolio-gallery'
import type { Database } from '@/lib/types/database.types'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/staff-common/components/types'

type StaffProfile = Database['public']['Views']['staff_profiles_view']['Row']
type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row'] | null

type ProfileClientProps = {
  profile: StaffProfile
  metadata: ProfileMetadata
  username: string | null
}

export function ProfileClient({ profile, metadata, username }: ProfileClientProps) {
  const initials = profile.full_name
    ? profile.full_name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : profile.email?.[0]?.toUpperCase() || '?'

  const summaries: StaffSummary[] = [
    {
      id: 'experience',
      label: 'Experience',
      value: profile.experience_years ? `${profile.experience_years} yrs` : '—',
      helper: 'Professional experience',
      tone: 'info',
    },
    {
      id: 'services',
      label: 'Services offered',
      value: profile.services_count?.toString() ?? '0',
      helper: 'Active services in catalog',
      tone: 'default',
    },
    {
      id: 'lead-time',
      label: 'Booking lead time',
      value:
        profile.booking_lead_time_hours === null || profile.booking_lead_time_hours === undefined
          ? '—'
          : profile.booking_lead_time_hours === 0
            ? 'Same day'
            : `${profile.booking_lead_time_hours} hrs`,
      helper: 'Minimum notice before new bookings',
      tone: 'info',
    },
    {
      id: 'appointments',
      label: 'Total appointments',
      value: profile.total_appointments?.toString() ?? '0',
      helper: 'Completed to date',
      tone: 'success',
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
          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-6 py-6 text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={metadata?.avatar_url || profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <p className="text-xl font-semibold leading-tight">
                    {profile.full_name || 'Staff member'}
                  </p>
                  {profile.title && <p className="text-muted-foreground">{profile.title}</p>}
                  {profile.email && (
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  )}
                </div>

                {profile.salon_name && (
                  <div className="w-full space-y-1 border-t pt-4">
                    <p className="text-sm font-medium">Salon</p>
                    <p className="text-sm text-muted-foreground">{profile.salon_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="view" className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View profile</TabsTrigger>
              <TabsTrigger value="edit">
                <span className="flex items-center gap-2">
                  <Edit className="h-4 w-4" aria-hidden="true" />
                  Edit profile
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Professional information
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profile.title && (
                      <div>
                        <p className="text-sm font-medium">Title</p>
                        <p className="text-sm text-muted-foreground">{profile.title}</p>
                      </div>
                    )}
                    {profile.experience_years !== null && profile.experience_years !== undefined && (
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.experience_years} years
                        </p>
                      </div>
                    )}
                    {profile.services_count !== null && profile.services_count !== undefined && (
                      <div>
                        <p className="text-sm font-medium">Services offered</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.services_count} services
                        </p>
                      </div>
                    )}
                    {profile.total_appointments !== null && profile.total_appointments !== undefined && (
                      <div>
                        <p className="text-sm font-medium">Total appointments</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.total_appointments} completed
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {profile.bio && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <CardTitle>About</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {profile.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {metadata?.interests && Array.isArray(metadata.interests) && metadata.interests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {metadata.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <ProfilePhotoUpload
                currentPhotoUrl={metadata?.avatar_url || profile.avatar_url}
                userName={profile.full_name || undefined}
              />
              <UsernameForm currentUsername={username} />
              <StaffInfoForm profile={profile} />
              <SpecialtiesEditor
                initialSpecialties={metadata?.tags?.filter((tag: string) => !tag.includes('certification:')) || []}
              />
              <CertificationsEditor
                initialCertifications={metadata?.tags?.filter((tag: string) => tag.includes('certification:'))?.map((tag: string) => tag.replace('certification:', '')) || []}
              />
              <PortfolioGallery portfolioImages={[]} />
              <MetadataForm metadata={metadata} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StaffPageShell>
  )
}
