import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Calendar } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Staff = Database['public']['Views']['staff_profiles_view']['Row']

interface StaffGridProps {
  staff: Staff[]
}

export function StaffGrid({ staff }: StaffGridProps) {
  if (staff.length === 0) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <CardTitle>Our team</CardTitle>
          <CardDescription>No staff members available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Our team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <HoverCard key={member['id'] || ''}>
              <HoverCardTrigger asChild>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Avatar>
                      {member['avatar_url'] && (
                        <AvatarImage src={member['avatar_url']} alt={member['title'] || 'Staff'} />
                      )}
                      <AvatarFallback>
                        {member['title']?.slice(0, 2).toUpperCase() || 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                      <CardTitle>{member['title'] || 'Staff member'}</CardTitle>
                      {member['bio'] && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {member['bio']}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {member['avatar_url'] && (
                      <AvatarImage src={member['avatar_url']} alt={member['title'] || 'Staff'} />
                    )}
                    <AvatarFallback>
                      {member['title']?.slice(0, 2).toUpperCase() || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-xl">{member['title'] || 'Staff member'}</h4>
                    {member['bio'] && <p className="text-sm text-muted-foreground">{member['bio']}</p>}
                  </div>
                </div>
                {member['bio'] && <p className="text-sm text-muted-foreground">{member['bio']}</p>}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Click to book an appointment</span>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
