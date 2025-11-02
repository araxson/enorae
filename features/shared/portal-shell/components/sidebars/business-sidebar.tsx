import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavMain, NavSecondary, NavUser } from '..'
import { BusinessSalonSwitcher } from '@/features/business/business-common/components/salon-switcher'
import { getMenuForUser } from '../../menu/get-menu-for-user'
import { verifySession } from '@/lib/auth/session'
import { getUnreadNotificationsCount } from '@/features/shared/notifications/api/queries'

export async function BusinessSidebar() {
  const session = await verifySession()

  if (!session) {
    return null
  }

  const menu = await getMenuForUser('business', session)

  const userData = {
    name: session.user.user_metadata?.['full_name'] || session.user['email'] || 'User',
    email: session.user['email'] || '',
    avatar: session.user.user_metadata?.['avatar_url'] || null,
    role: session.role,
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/business">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Business Portal</span>
                  <span className="truncate text-xs text-muted-foreground">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <NavMain items={menu.navMain} />

        {/* Business-specific: Salon Switcher */}
        <div className="px-2 py-2">
          <BusinessSalonSwitcher />
        </div>

        {/* Secondary Navigation (Support, Settings, etc.) */}
        {menu.navSecondary && menu.navSecondary.length > 0 && (
          <NavSecondary items={menu.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} portal="business" />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
