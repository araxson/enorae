import { Card, CardContent, CardHeader, CardTitle } from '@enorae/ui'
import { Avatar, AvatarFallback } from '@enorae/ui'
import type { Staff } from '../types/salon.types'

interface StaffGridProps {
  staff: Staff[]
}

export function StaffGrid({ staff }: StaffGridProps) {
  if (staff.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {member.title?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
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
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}