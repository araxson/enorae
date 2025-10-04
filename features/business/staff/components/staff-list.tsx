import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Stack, Group } from '@/components/layout'
import { H4, Muted } from '@/components/ui/typography'
import { EmptyState } from '@/components/shared/empty-state'
import { Users } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Staff = Database['public']['Views']['staff']['Row']

interface StaffListProps {
  staff: Staff[]
}

export function StaffList({ staff }: StaffListProps) {
  if (staff.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No staff members"
        description="Add staff members to your team to get started"
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          {staff.map((member) => (
            <Group
              key={member.id || ''}
              gap="md"
              className="pb-4 border-b last:border-0 last:pb-0"
            >
              <Avatar>
                {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.title || 'Staff'} />}
                <AvatarFallback>
                  {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>

              <Stack gap="xs" className="flex-1">
                <H4 className="text-base">{member.title || 'Staff Member'}</H4>
                {member.bio && <Muted className="line-clamp-2">{member.bio}</Muted>}
              </Stack>

              <Badge variant="default">
                Active
              </Badge>
            </Group>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
