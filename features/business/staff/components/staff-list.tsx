import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
        <div className="flex flex-col gap-4">
          {staff.map((member) => (
            <div
              key={member.id || ''}
              className="flex gap-4 items-center pb-4 border-b last:border-0 last:pb-0"
            >
              <Avatar>
                {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.title || 'Staff'} />}
                <AvatarFallback>
                  {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2 flex-1">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-base">{member.title || 'Staff Member'}</h4>
                {member.bio && <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>}
              </div>

              <Badge variant="default">
                Active
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
