import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Stack, Group, Box } from '@/components/layout'
import { H2, Muted } from '@/components/ui/typography'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Views']['profiles']['Row']

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent>
        <Box pt="md">
          <Group gap="md" align="center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {profile.username?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <Stack gap="xs">
              <H2>{profile.username || 'User'}</H2>
              <Muted>Profile ID: {profile.id}</Muted>
            </Stack>
          </Group>
        </Box>
      </CardContent>
    </Card>
  )
}
