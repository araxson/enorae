import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
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
        <CardContent className="py-10 text-center text-muted-foreground">
          No staff members available
        </CardContent>
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
            <HoverCard key={member.id || ''}>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
                  <Avatar>
                    {member.avatar_url && (
                      <AvatarImage src={member.avatar_url} alt={member.title || 'Staff'} />
                    )}
                    <AvatarFallback>
                      {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Small>{member.title || 'Staff member'}</Small>
                    {member.bio && (
                      <Muted className="line-clamp-1 text-xs">{member.bio}</Muted>
                    )}
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {member.avatar_url && (
                      <AvatarImage src={member.avatar_url} alt={member.title || 'Staff'} />
                    )}
                    <AvatarFallback>
                      {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <H4>{member.title || 'Staff member'}</H4>
                    {member.bio && <Muted>{member.bio}</Muted>}
                  </div>
                </div>
                {member.bio && <P className="text-sm text-muted-foreground">{member.bio}</P>}
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
