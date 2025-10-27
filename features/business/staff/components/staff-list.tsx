import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/features/shared/ui-components'
import { Users } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Staff = Database['public']['Views']['staff_profiles_view']['Row']

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
        <div className="space-y-3">
          {staff.map((member, index) => (
            <Card key={member['id'] || `${member['title']}-${index}`}>
              <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                <Avatar>
                  <AvatarFallback>
                    {member['title']?.slice(0, 2).toUpperCase() || 'ST'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="text-base">{member['title'] || 'Staff Member'}</div>
                  {member['bio'] ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{member['bio']}</p>
                  ) : null}
                </div>

                <Badge variant="default">
                  Active
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
