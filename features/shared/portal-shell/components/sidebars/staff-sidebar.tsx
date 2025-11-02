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
import { getMenuForUser } from '../../menu/get-menu-for-user'
import { verifySession } from '@/lib/auth/session'
import { getUnreadNotificationsCount } from '@/features/shared/notifications/api/queries'

export async function StaffSidebar() {
  const session = await verifySession()

  if (!session) {
    return null
  }

  let menu = await getMenuForUser('staff', session)

  // Add unread notification badge for staff portal
  try {
    const unreadCount = await getUnreadNotificationsCount()
    if (unreadCount > 0) {
      menu = {
        ...menu,
        navMain: menu.navMain.map((item) =>
          item.url === '/staff/notifications' ? { ...item, badge: unreadCount } : item
        ),
      }
    }
  } catch (error) {
    console.error('Error fetching unread notifications:', error)
  }

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
              <Link href="/staff">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Staff Portal</span>
                  <span className="truncate text-xs text-muted-foreground">Schedule</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <NavMain items={menu.navMain} />

        {/* Secondary Navigation (Support, Settings, etc.) */}
        {menu.navSecondary && menu.navSecondary.length > 0 && (
          <NavSecondary items={menu.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} portal="staff" />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
