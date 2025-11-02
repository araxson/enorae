import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProfileDetail } from '@/features/admin/profile/types'
import {
  Item,
  ItemContent,
  ItemGroup,
} from '@/components/ui/item'
import { ProfileSummaryLoading } from './profile-summary-loading'
import { ProfileSummaryEmpty } from './profile-summary-empty'
import { ProfileSummaryContent } from './profile-summary-content'

interface ProfileSummaryCardProps {
  profile: ProfileDetail | null
  isLoading: boolean
}

export function ProfileSummaryCard({ profile, isLoading }: ProfileSummaryCardProps) {
  if (isLoading) {
    return <ProfileSummaryLoading />
  }

  if (!profile) {
    return <ProfileSummaryEmpty />
  }

  return (
    <Card>
      <CardHeader>
        <div className="pb-4">
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <CardTitle>Profile overview</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ProfileSummaryContent profile={profile} />
      </CardContent>
    </Card>
  )
}
