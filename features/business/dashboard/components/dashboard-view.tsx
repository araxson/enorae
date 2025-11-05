'use client'

import Link from 'next/link'
import { type ReactNode, useMemo } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Calendar,
  LayoutDashboard,
  LineChart,
  Settings,
  Users,
  Bell,
  PieChart,
} from 'lucide-react'
import type { BusinessDashboardState } from '@/features/business/dashboard/api/types'
import { DashboardToolbar } from './dashboard-toolbar'
import { DashboardFilters } from './dashboard-filters'
import { DashboardChainOverview } from './dashboard-chain-overview'
import { DashboardTabs } from './dashboard-tabs'

type DashboardViewProps = BusinessDashboardState & {
  analyticsPanel: ReactNode
}

export function DashboardView({
  salon,
  metrics,
  reviewStats,
  recentAppointments,
  multiLocationMetrics,
  isTenantOwner,
  analyticsPanel,
}: DashboardViewProps) {
  const overviewLinks = useMemo(
    () => [
      { href: '/business', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/business/appointments', label: 'Appointments', icon: Calendar },
      { href: '/business/staff', label: 'Staff', icon: Users },
      { href: '/business/notifications', label: 'Notifications', icon: Bell },
    ],
    []
  )

  const analyticsLinks = useMemo(
    () => [
      { href: '/business/analytics', label: 'Analytics', icon: LineChart },
      { href: '/business/insights', label: 'Insights', icon: PieChart },
      { href: '/business/settings', label: 'Settings', icon: Settings },
    ],
    []
  )

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-1">
          <span className="text-xs font-medium text-sidebar-foreground/70">
            Business Portal
          </span>
          <span className="text-sm font-semibold">{salon.name ?? 'Salon'}</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {overviewLinks.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild>
                      <Link href={href}>
                        <Icon className="size-4" aria-hidden="true" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Performance</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsLinks.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild>
                      <Link href={href}>
                        <Icon className="size-4" aria-hidden="true" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-xs text-sidebar-foreground/70">
          Need help?{' '}
          <Link href="/support" className="underline underline-offset-4">
            Contact support
          </Link>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/business">Business</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <section className="flex flex-1 flex-col gap-6 px-6 py-10">
          <DashboardToolbar
            salonName={salon.name ?? 'Salon'}
            isTenantOwner={isTenantOwner}
            totalLocations={multiLocationMetrics?.totalLocations}
          />

          <DashboardFilters />

          {isTenantOwner && multiLocationMetrics ? (
            <DashboardChainOverview metrics={multiLocationMetrics} />
          ) : null}

          <DashboardTabs
            metrics={metrics}
            reviewStats={reviewStats}
            appointments={recentAppointments}
            analyticsPanel={analyticsPanel}
          />
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
