import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Avatar, AvatarFallback } from '@enorae/ui'
import { Button } from '@enorae/ui'
import type { Profile } from '../types/profile.types'

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = profile.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
              <p className="text-muted-foreground">{profile.email}</p>
              {profile.phone && (
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
              )}
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </CardHeader>
    </Card>
  )
}