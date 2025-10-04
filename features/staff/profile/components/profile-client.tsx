'use client'

import { User, Briefcase, Edit } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Stack } from '@/components/layout'
import { H2, P, Muted } from '@/components/ui/typography'
import { StaffInfoForm } from './staff-info-form'
import { MetadataForm } from '@/features/shared/profile-metadata/components/metadata-form'
import { UsernameForm } from '@/features/shared/profile/components/username-form'
import type { Database } from '@/lib/types/database.types'

type StaffProfile = Database['public']['Views']['staff']['Row']
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
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : profile.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Sidebar */}
      <Card className="lg:col-span-1 h-fit">
        <CardContent className="pt-6">
          <Stack gap="lg" className="items-center text-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={metadata?.avatar_url || profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <H2 className="text-xl">{profile.full_name || 'Staff Member'}</H2>
              {profile.title && <P className="text-muted-foreground">{profile.title}</P>}
              {profile.email && <Muted className="text-sm">{profile.email}</Muted>}
            </div>
            {profile.salon_name && (
              <div className="w-full pt-4 border-t">
                <P className="text-sm font-medium">Salon</P>
                <Muted>{profile.salon_name}</Muted>
              </div>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Profile</TabsTrigger>
            <TabsTrigger value="edit">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </TabsTrigger>
          </TabsList>

          {/* View Tab */}
          <TabsContent value="view" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.title && (
                    <div>
                      <P className="text-sm font-medium">Title</P>
                      <Muted>{profile.title}</Muted>
                    </div>
                  )}
                  {profile.experience_years !== null && profile.experience_years !== undefined && (
                    <div>
                      <P className="text-sm font-medium">Experience</P>
                      <Muted>{profile.experience_years} years</Muted>
                    </div>
                  )}
                  {profile.services_count !== null && profile.services_count !== undefined && (
                    <div>
                      <P className="text-sm font-medium">Services Offered</P>
                      <Muted>{profile.services_count} services</Muted>
                    </div>
                  )}
                  {profile.total_appointments !== null &&
                    profile.total_appointments !== undefined && (
                      <div>
                        <P className="text-sm font-medium">Total Appointments</P>
                        <Muted>{profile.total_appointments} completed</Muted>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <P className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {profile.bio}
                  </P>
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
                    {metadata.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-6">
            <UsernameForm currentUsername={username} />
            <StaffInfoForm profile={profile} />
            <MetadataForm metadata={metadata} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
