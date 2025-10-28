import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Calendar } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'

type Staff = Database['public']['Views']['staff_profiles_view']['Row']

interface StaffGridProps {
  staff: Staff[]
}

export function StaffGrid({ staff }: StaffGridProps) {
  if (staff.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No staff members available</EmptyTitle>
              <EmptyDescription>
                Check back soon to meet the stylists working at this salon.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Calendar className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Our team</CardTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <HoverCard key={member['id'] || ''}>
              <HoverCardTrigger asChild>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <ItemGroup className="items-center gap-3">
                      <Item>
                        <ItemMedia>
                          <Avatar>
                            <AvatarFallback>
                              {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <CardTitle>{member['title'] || 'Staff member'}</CardTitle>
                          {member['bio'] ? (
                            <div className="line-clamp-2">
                              <CardDescription>{member['bio']}</CardDescription>
                            </div>
                          ) : null}
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  </CardHeader>
                  <CardContent />
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback>
                      {member.title?.slice(0, 2).toUpperCase() || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-xl">{member['title'] || 'Staff member'}</h4>
                    {member['bio'] && <CardDescription>{member['bio']}</CardDescription>}
                  </div>
                </div>
                {member['bio'] && <CardDescription>{member['bio']}</CardDescription>}
                <Item>
                  <ItemMedia variant="icon">
                    <Calendar className="size-3" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>
                      <span className="text-xs text-muted-foreground">Click to book an appointment</span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
