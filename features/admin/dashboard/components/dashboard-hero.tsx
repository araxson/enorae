import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { DataRefreshControls } from '@/features/shared/dashboard/components/data-refresh-controls'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Activity,
  LineChart,
  MessageSquareWarning,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type PlatformMetrics = Awaited<ReturnType<typeof import('@/features/admin/dashboard/api/queries').getPlatformMetrics>>

export function DashboardHero({ metrics }: { metrics: PlatformMetrics }) {
  const generatedAt = new Date().toISOString()

  return (
    <TooltipProvider delayDuration={150}>
      <Card>
        <CardHeader>
          <ItemGroup className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Item variant="muted" className="flex-col gap-3">
              <ItemContent>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col gap-1">
                  <ItemTitle>Platform control center</ItemTitle>
                  <ItemDescription>
                    Monitor platform health, engagement, and operational signals in real time.
                  </ItemDescription>
                </div>
              </ItemContent>
            </Item>

            <Item variant="muted">
              <ItemActions>
                <Badge variant="outline">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                  {' '}
                  Live feed
                </Badge>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>

        <CardContent>
          <ItemGroup className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Item variant="muted" className="flex-wrap items-center gap-3">
              <ItemContent>
                <div className="flex flex-wrap items-center gap-3">
                  <DataRefreshControls generatedAt={generatedAt} tooltip="Refresh dashboard data" />
                  <ItemDescription>
                    {`Synced across ${metrics.totalSalons.toLocaleString()} ${
                      metrics.totalSalons === 1 ? 'salon' : 'salons'
                    }`}
                  </ItemDescription>
                  {metrics.pendingVerifications > 0 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/admin/users">
                          <Badge variant="secondary">
                            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                            {' '}
                            {metrics.pendingVerifications}{' '}
                            {metrics.pendingVerifications === 1 ? 'unverified user' : 'unverified users'}
                          </Badge>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Click to view users with unverified email addresses</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </ItemContent>
            </Item>

            <Item variant="muted">
              <ItemContent>
                <ButtonGroup className="flex flex-wrap items-center gap-2">
              <Button asChild size="sm">
                <Link href="/admin/chains">Manage chains</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    {' '}
                    Quick actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Navigate to</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/analytics" className="flex items-center gap-2">
                      <LineChart className="h-4 w-4" aria-hidden="true" />
                      <span>Platform analytics</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/moderation" className="flex items-center gap-2">
                      <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
                      <span>Review moderation</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/security" className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      <span>Security center</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                </ButtonGroup>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
