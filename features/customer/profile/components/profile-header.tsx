import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles']['Row']

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
          <AvatarFallback className="text-xl">
            {profile.username?.slice(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <CardTitle>{profile.full_name || profile.username || 'User'}</CardTitle>
          <CardDescription>
            {profile.username ? `@${profile.username}` : `ID: ${profile.id}`}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
