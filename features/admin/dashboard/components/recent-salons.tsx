import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import Link from 'next/link'
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
  ItemGroup,
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
      <Empty>
        <EmptyMedia variant="icon">
          <Building2 />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No salons yet</EmptyTitle>
          <EmptyDescription>As soon as salons join, their onboarding progress appears here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Invite partners or import salon data to populate this list.</EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="h-full">
      <Card>
        <CardHeader className="space-y-3">
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>Recent salons</CardTitle>
                <CardDescription>
                  Latest teams that completed onboarding in the last 30 days.
                </CardDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">{salons.length} new</Badge>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {salons.slice(0, 8).map((salon) => (
                  <TableRow key={salon['id']} className="last:border-0">
                    <TableCell>
                      <div className="flex min-w-0 items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="text-xs font-semibold">
                            {getInitials(salon['name'])}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 space-y-1">
                          <p className="truncate font-medium leading-tight">
                            {salon['name'] || 'Unnamed salon'}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {`${salon['location_count'] ?? 0} location${(salon['location_count'] ?? 0) === 1 ? '' : 's'} • ${salon['staff_count'] ?? 0} staff`}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground xl:table-cell">
                      {safeFormatDate(salon['created_at'], 'MMM d, yyyy', 'Recently')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={salon['is_accepting_bookings'] ? 'default' : 'outline'}
                        className="justify-end gap-1"
                      >
                        {salon['is_accepting_bookings'] ? 'Accepting bookings' : 'Paused'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <ButtonGroup>
            <Button asChild variant="ghost" size="sm" className="gap-1 px-0 text-xs font-semibold">
              <Link href="/admin/salons">
                View all salons
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>
    </div>
  )
}
