import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Users } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Staff = Database['public']['Views']['staff_profiles_view']['Row']

interface StaffListProps {
  staff: Staff[]
}

export function StaffList({ staff }: StaffListProps) {
  if (staff.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Users className="size-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No staff members</EmptyTitle>
          <EmptyDescription>Add staff members to your team to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Invite team members to assign roles and manage bookings.</EmptyContent>
      </Empty>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Members</CardTitle>
        <CardDescription>Overview of active team members and their profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {staff.map((member, index) => (
            <Item
              key={member['id'] || `${member['title']}-${index}`}
              variant="outline"
              className="sm:items-center"
            >
              <ItemMedia className="flex-shrink-0">
                <Avatar>
                  <AvatarFallback>
                    {member['title']?.slice(0, 2).toUpperCase() || 'ST'}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>

              <ItemContent>
                <ItemTitle>{member['title'] || 'Staff Member'}</ItemTitle>
                {member['bio'] ? (
                  <ItemDescription>{member['bio']}</ItemDescription>
                ) : null}
              </ItemContent>

              <ItemActions>
                <Badge variant="default">Active</Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
