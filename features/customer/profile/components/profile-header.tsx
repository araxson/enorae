import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles_view']['Row']
type ProfileMetadata = Database['public']['Views']['profiles_metadata_view']['Row']

interface ProfileHeaderProps {
  profile: Profile
  metadata?: ProfileMetadata | null
}

export function ProfileHeader({ profile, metadata }: ProfileHeaderProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {metadata?.avatar_url && <AvatarImage src={metadata.avatar_url} />}
          <AvatarFallback className="text-xl">
            {profile.username?.slice(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <CardTitle>{profile.username || 'User'}</CardTitle>
          <CardDescription>
            {profile.username ? `@${profile.username}` : `ID: ${profile.id ?? 'unknown'}`}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Manage your profile preferences and personal information below.
        </p>
      </CardContent>
    </Card>
  )
}
