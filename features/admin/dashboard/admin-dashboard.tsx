import Link from 'next/link'
import {
  getPlatformMetrics,
  getRecentSalons,
  getUserStats,
  getAdminOverview,
} from './api/queries'
import { PlatformMetrics } from './components/platform-metrics'
import { RecentSalons } from './components/recent-salons'
import { UserRoleStats } from './components/user-role-stats'
import { AdminOverviewTabs } from './components/admin-overview-tabs'
import { RefreshButton, LastUpdated } from '@/features/shared/ui-components'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Activity,
  AlertTriangle,
  LineChart,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
  Settings,
} from 'lucide-react'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export async function AdminDashboardPage() {
  let platformMetrics
  let recentSalons
  let userStats
  let adminOverview

  try {
    ;[platformMetrics, recentSalons, userStats, adminOverview] = await Promise.all([
      getPlatformMetrics(),
      getRecentSalons(),
      getUserStats(),
      getAdminOverview(),
    ])
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error('[AdminDashboard] Error loading data:', {
      error: errorMessage,
      errorObject: error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    if (errorMessage.includes('role required') || errorMessage.includes('Unauthorized')) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTitle>Access denied</AlertTitle>
            <AlertDescription>
              Admin privileges are required to view this dashboard.
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Dashboard error</AlertTitle>
          <AlertDescription>
            {errorMessage}
            <br />
            Try refreshing the page or contact support if the problem continues.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!platformMetrics || !recentSalons || !userStats || !adminOverview) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Alert>
          <AlertTitle>Partial data</AlertTitle>
          <AlertDescription>
            Some dashboard data is unavailable right now. Please try again shortly.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item className="w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" variant="muted">
              <ItemMedia variant="icon">
                <Activity className="size-5" aria-hidden="true" />
              </ItemMedia>
              <ItemContent className="flex flex-col gap-3">
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
              <ItemActions className="flex-none">
                <div className="rounded-full border border-foreground/20 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Badge variant="outline">Live feed</Badge>
                </div>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <ItemGroup className="w-full">
              <Item variant="muted" className="w-full">
              <ItemContent className="flex w-full flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <LastUpdated />
                <Separator orientation="vertical" className="hidden h-4 lg:flex" />
                <span>
                  {`Synced across ${platformMetrics.totalSalons.toLocaleString()} ${platformMetrics.totalSalons === 1 ? 'salon' : 'salons'}`}
                </span>
                {platformMetrics.pendingVerifications > 0 && (
                  <>
                    <Separator orientation="vertical" className="hidden h-4 lg:flex" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/admin/users" className="inline-flex items-center">
                          <Badge variant="secondary">
                            <ShieldAlert className="mr-1 size-3" />
                            {platformMetrics.pendingVerifications}{' '}
                            {platformMetrics.pendingVerifications === 1 ? 'unverified user' : 'unverified users'}
                          </Badge>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        Click to view users with unverified email addresses
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </ItemContent>
            </Item>
            </ItemGroup>

            <ButtonGroup aria-label="Dashboard actions">
              <Tooltip>
                <TooltipTrigger asChild>
                  <RefreshButton />
                </TooltipTrigger>
                <TooltipContent>Refresh dashboard data</TooltipContent>
              </Tooltip>

              <Button asChild size="sm">
                <Link href="/admin/chains" className="flex items-center gap-2">
                  Manage chains
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 size-4" />
                    Quick actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel>Navigate to</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/analytics" className="flex items-center gap-2">
                      <LineChart className="size-4" />
                      Platform analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/moderation" className="flex items-center gap-2">
                      <MessageSquareWarning className="size-4" />
                      Review moderation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/security" className="flex items-center gap-2">
                      <ShieldCheck className="size-4" />
                      Security center
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>

      <PlatformMetrics metrics={platformMetrics} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RecentSalons salons={recentSalons} />
        <UserRoleStats stats={userStats} />
      </div>

      <AdminOverviewTabs
        revenue={adminOverview.revenue ?? []}
        appointments={adminOverview.appointments ?? []}
        reviews={adminOverview.reviews ?? []}
        messages={adminOverview.messages ?? []}
        staff={adminOverview.staff ?? []}
      />
    </div>
  )
}
