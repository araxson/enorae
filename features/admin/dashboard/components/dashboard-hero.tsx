import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { DataRefreshControls } from '@/features/shared/dashboard/components/data-refresh-controls'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Activity,
  AlertTriangle,
  LineChart,
  MessageSquareWarning,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'

type PlatformMetrics = Awaited<ReturnType<typeof import('../api/queries').getPlatformMetrics>>
type BadgeProps = ComponentProps<typeof Badge>

export function DashboardHero({ metrics }: { metrics: PlatformMetrics }) {
  const generatedAt = new Date().toISOString()

  return (
    <TooltipProvider delayDuration={150}>
      <Card>
        <CardHeader className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
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

            <div className="space-y-1">
              <CardTitle>
                Platform control center
              </CardTitle>
              <CardDescription>
                Monitor platform health, engagement, and operational signals in real time.
              </CardDescription>
            </div>
          </div>

          <BadgePill variant="outline">
            <Activity className="h-3.5 w-3.5" />
            Live feed
          </BadgePill>
        </div>
      </CardHeader>

        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <DataRefreshControls generatedAt={generatedAt} tooltip="Refresh dashboard data" />
          <p className="text-base mt-0 text-sm text-muted-foreground">
            {`Synced across ${metrics.totalSalons.toLocaleString()} ${
              metrics.totalSalons === 1 ? 'salon' : 'salons'
            }`}
          </p>

          <DashboardBadge
            show={metrics.lowStockAlerts > 0}
            href="/admin/inventory"
            variant="destructive"
            icon={<AlertTriangle className="h-3 w-3" />}
            label={`${metrics.lowStockAlerts} ${
              metrics.lowStockAlerts === 1 ? 'stock alert' : 'stock alerts'
            }`}
            tooltip="Click to view inventory alerts and resolve low stock issues"
          />

          <DashboardBadge
            show={metrics.pendingVerifications > 0}
            href="/admin/users"
            variant="secondary"
            icon={<ShieldAlert className="h-3 w-3" />}
            label={`${metrics.pendingVerifications} ${
              metrics.pendingVerifications === 1 ? 'unverified user' : 'unverified users'
            }`}
            tooltip="Click to view users with unverified email addresses"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="default" asChild size="sm">
            <Link href="/admin/chains">Manage chains</Link>
          </Button>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Quick actions</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <Card>
                    <CardHeader>
                      <CardDescription>Navigate to</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 p-2">
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                          <Link href="/admin/analytics">
                            <LineChart className="h-4 w-4" />
                            Platform analytics
                          </Link>
                        </Button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                          <Link href="/admin/moderation">
                            <MessageSquareWarning className="h-4 w-4" />
                            Review moderation
                          </Link>
                        </Button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                          <Link href="/admin/security">
                            <ShieldCheck className="h-4 w-4" />
                            Security center
                          </Link>
                        </Button>
                      </NavigationMenuLink>
                    </CardContent>
                  </Card>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

function DashboardBadge({
  show,
  href,
  variant,
  icon,
  label,
  tooltip,
}: {
  show: boolean
  href: string
  variant: BadgeProps['variant']
  icon: ReactNode
  label: string
  tooltip: string
}) {
  if (!show) return null

  return (
    <>
      <Separator orientation="vertical" className="hidden h-4 lg:flex" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <Badge variant={variant} className="gap-1.5 hover:opacity-90">
              {icon}
              {label}
            </Badge>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </>
  )
}

function BadgePill({ children, ...props }: BadgeProps & { children: ReactNode }) {
  return (
    <Badge
      {...props}
      className="flex w-fit items-center gap-2 rounded-full border-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
    >
      {children}
    </Badge>
  )
}
