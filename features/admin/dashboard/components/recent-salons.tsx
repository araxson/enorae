import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { AdminSalon } from '@/features/admin/salons'
import { safeFormatDate } from './admin-overview-utils'
import { ArrowUpRight, Building2 } from 'lucide-react'
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
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

interface RecentSalonsProps {
  salons: AdminSalon[]
}

const getInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return 'NA'
  const trimmed = name.trim()
  if (!trimmed) return 'NA'

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'NA'
  if (parts.length === 1) {
    const firstPart = parts[0]
    return firstPart ? firstPart.slice(0, 2).toUpperCase() : 'NA'
  }

  const firstInitial = parts[0]?.[0]
  const secondInitial = parts[1]?.[0]
  if (!firstInitial || !secondInitial) return 'NA'

  return `${firstInitial}${secondInitial}`.toUpperCase()
}

export function RecentSalons({ salons }: RecentSalonsProps) {
  if (salons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3">
            <ItemGroup>
              <Item>
                <ItemContent>
                  <ItemTitle>Recent salons</ItemTitle>
                  <ItemDescription>
                    Latest teams that completed onboarding in the last 30 days.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Building2 className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No salons yet</EmptyTitle>
              <EmptyDescription>
                As soon as salons join, their onboarding progress appears here.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>Invite partners or import salon data to populate this list.</EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-3">
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Recent salons</ItemTitle>
                <ItemDescription>
                  Latest teams that completed onboarding in the last 30 days.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">{salons.length} new</Badge>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-80 pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead className="hidden xl:table-cell">Onboarded</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salons.slice(0, 8).map((salon) => {
                const locationCount = salon['location_count'] ?? 0
                const staffCount = salon['staff_count'] ?? 0
                const onboarding = safeFormatDate(salon['created_at'], 'MMM d, yyyy', 'Recently')

                return (
                  <TableRow key={salon['id']}>
                    <TableCell>
                      <Item size="sm">
                        <ItemMedia>
                          <Avatar>
                            <AvatarFallback className="text-xs font-semibold">
                              {getInitials(salon['name'])}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{salon['name'] || 'Unnamed salon'}</ItemTitle>
                          <ItemDescription>
                            {locationCount} location{locationCount === 1 ? '' : 's'} • {staffCount}{' '}
                            staff
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                      {onboarding}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={salon['is_accepting_bookings'] ? 'default' : 'outline'}>
                        {salon['is_accepting_bookings'] ? 'Accepting bookings' : 'Paused'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>

          <ButtonGroup aria-label="Salon shortcuts">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/salons">
                View all salons
                <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </ButtonGroup>
        </div>
      </CardContent>
    </Card>
  )
}
