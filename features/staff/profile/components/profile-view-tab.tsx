import { User, Briefcase } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'

type StaffProfile = Database['public']['Views']['staff_enriched_view']['Row']
type ProfileMetadata = Database['identity']['Tables']['profiles_metadata']['Row'] | null

interface ProfileViewTabProps {
  profile: StaffProfile
  metadata: ProfileMetadata
}

export function ProfileViewTab({ profile, metadata }: ProfileViewTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Professional information</CardTitle>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent>
          <ItemGroup className="grid gap-4 sm:grid-cols-2">
            {profile.title ? (
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>
                    <Badge variant="outline">Title</Badge>
                  </ItemTitle>
                  <ItemDescription>{profile.title}</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}
            {profile.experience_years !== null && profile.experience_years !== undefined ? (
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>
                    <Badge variant="outline">Experience</Badge>
                  </ItemTitle>
                  <ItemDescription>{profile.experience_years} years</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}
          </ItemGroup>
        </CardContent>
      </Card>

      {profile.bio && (
        <Card>
          <CardHeader>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <User className="h-5 w-5" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <CardTitle>About</CardTitle>
              </ItemContent>
            </Item>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">
              <CardDescription>{profile.bio}</CardDescription>
            </div>
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
    </div>
  )
}
