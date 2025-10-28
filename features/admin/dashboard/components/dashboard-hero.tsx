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
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { DataRefreshControls } from '@/features/shared/dashboard/components/data-refresh-controls'
import { Kbd } from '@/components/ui/kbd'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  LineChart,
  MessageSquareWarning,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item'

type PlatformMetrics = Awaited<
  ReturnType<
    typeof import('@/features/admin/dashboard/api/queries').getPlatformMetrics
  >
>

export function DashboardHero({ metrics }: { metrics: PlatformMetrics }) {
  const generatedAt = new Date().toISOString()

  return (
    <TooltipProvider delayDuration={150}>
      <Card>
        <CardHeader>
          <ItemGroup className="gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Item variant="muted" className="lg:flex-1">
              <ItemContent className="gap-2">
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
                <ItemTitle>Platform control center</ItemTitle>
                <ItemDescription>
                  Monitor platform health, engagement, and operational signals in real time.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <div className="flex items-center gap-2">
                  <Spinner aria-hidden="true" className="size-3.5" />
                  <Badge variant="outline">Live feed</Badge>
                </div>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>

        <CardContent>
          <ItemGroup className="gap-4 lg:flex-row lg:items-start">
            <Item variant="muted" className="lg:flex-1">
              <ItemContent className="gap-3">
                <DataRefreshControls generatedAt={generatedAt} tooltip="Refresh dashboard data" />
                <ItemDescription>
                  Synced across {metrics.totalSalons.toLocaleString()}{' '}
                  {metrics.totalSalons === 1 ? 'salon' : 'salons'} • Press{' '}
                  <Kbd aria-label="Refresh dashboard">R</Kbd> to refresh
                </ItemDescription>
              </ItemContent>
              {metrics.pendingVerifications > 0 ? (
                <ItemActions>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/admin/users">
                        <Badge variant="secondary">
                          <ShieldAlert className="size-4" aria-hidden="true" />{' '}
                          {metrics.pendingVerifications}{' '}
                          {metrics.pendingVerifications === 1
                            ? 'unverified user'
                            : 'unverified users'}
                        </Badge>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      View users with unverified email addresses
                    </TooltipContent>
                  </Tooltip>
                </ItemActions>
              ) : null}
            </Item>

            <Item variant="muted" className="lg:flex-1">
              <ItemContent className="gap-1">
                <ItemTitle>Quick actions</ItemTitle>
                <ItemDescription>Jump directly to admin management tools.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ButtonGroup aria-label="Admin quick actions">
                  <ButtonGroup>
                    <Button asChild size="sm">
                      <Link href="/admin/chains">Manage chains</Link>
                    </Button>
                  </ButtonGroup>
                  <ButtonGroupSeparator />
                  <ButtonGroup>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="size-4" aria-hidden="true" /> Quick actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Navigate to</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/analytics">
                            <LineChart className="size-4" aria-hidden="true" /> Platform analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/moderation">
                            <MessageSquareWarning className="size-4" aria-hidden="true" /> Review moderation
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/security">
                            <ShieldCheck className="size-4" aria-hidden="true" /> Security center
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ButtonGroup>
                </ButtonGroup>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
