import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles_view']['Row']
type ProfileMetadata = Database['public']['Views']['profiles_metadata_view']['Row']

interface ProfileHeaderProps {
  profile: Profile
  metadata?: ProfileMetadata | null
}

export function ProfileHeader({ profile, metadata }: ProfileHeaderProps) {
  const initials = profile.username?.slice(0, 2).toUpperCase() || 'U'
  const displayHandle = profile.username ? `@${profile.username}` : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile.username || 'User'}</CardTitle>
        <CardDescription>{displayHandle ?? `ID: ${profile.id ?? 'unknown'}`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup>
          <Item>
            <ItemMedia>
              <Avatar className="size-16">
                {metadata?.avatar_url ? <AvatarImage src={metadata.avatar_url} /> : null}
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Manage your profile preferences</ItemTitle>
              <ItemDescription>
                Keep your personal details up-to-date for tailored recommendations.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
              <p className="text-sm text-foreground">{profile.email ?? 'Not provided'}</p>
            </ItemContent>
          </Item>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Last updated</ItemTitle>
              <p className="text-sm text-foreground">
                {profile.updated_at
                  ? new Date(profile.updated_at).toLocaleDateString()
                  : 'Not available'}
              </p>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
