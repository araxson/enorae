import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles']['Row']

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16">
          {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
          <AvatarFallback className="text-xl">
            {profile.username?.slice(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <p className="leading-7 text-lg font-semibold leading-tight">
            {profile.full_name || profile.username || 'User'}
          </p>
          <p className="text-sm text-muted-foreground text-sm">{profile.username ? `@${profile.username}` : `ID: ${profile.id}`}</p>
        </div>
      </CardContent>
    </Card>
  )
}
