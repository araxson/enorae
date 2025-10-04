import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Grid, Stack, Group, Box } from '@/components/layout'
import { H4, Muted, P, Small } from '@/components/ui/typography'
import { Calendar } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Staff = Database['public']['Views']['staff']['Row']

interface StaffGridProps {
  staff: Staff[]
}

export function StaffGrid({ staff }: StaffGridProps) {
  if (staff.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box pt="md">
            <Muted>No staff members available</Muted>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Team</CardTitle>
      </CardHeader>
      <CardContent>
        <Grid cols={{ base: 1, sm: 2, md: 3 }} gap="md">
          {staff.map((member) => (
            <HoverCard key={member.id || ''}>
              <HoverCardTrigger asChild>
                <Box p="xs" className="hover:bg-muted/50 rounded-lg transition-colors">
                  <Group gap="sm">
                    <Avatar>
                      {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.title || 'Staff'} />}
                      <AvatarFallback>
                        {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <Stack gap="none">
                      <Small>{member.title || 'Staff Member'}</Small>
                      {member.bio && (
                        <Muted className="line-clamp-1">{member.bio}</Muted>
                      )}
                    </Stack>
                  </Group>
                </Box>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <Stack gap="sm">
                  <Group gap="sm">
                    <Avatar className="h-12 w-12">
                      {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.title || 'Staff'} />}
                      <AvatarFallback>
                        {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <Stack gap="none">
                      <H4>{member.title || 'Staff Member'}</H4>
                      {member.bio && <Muted>{member.bio}</Muted>}
                    </Stack>
                  </Group>
                  {member.bio && (
                    <P>{member.bio}</P>
                  )}
                  <Group gap="xs">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <Small className="text-muted-foreground">Click to book an appointment</Small>
                  </Group>
                </Stack>
              </HoverCardContent>
            </HoverCard>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
