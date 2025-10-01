import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { Avatar, AvatarFallback } from '@enorae/ui'
import { Badge } from '@enorae/ui'
import type { Staff } from '../types/staff.types'

interface StaffListProps {
  staff: Staff[]
}

export function StaffList({ staff }: StaffListProps) {
  if (staff.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No staff members yet. Add your first team member to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {staff.map((member) => (
        <Card key={member.id}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {member.title?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{member.title}</CardTitle>
                {member.experience_years && (
                  <p className="text-sm text-muted-foreground">
                    {member.experience_years} years experience
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          {member.bio && (
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/business/staff/${member.id}/edit`}>Edit</a>
                </Button>
                <Button variant="outline" size="sm">
                  View Schedule
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}