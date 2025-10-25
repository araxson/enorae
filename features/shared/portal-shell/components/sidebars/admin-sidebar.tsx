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
import { NavMain } from '@/features/shared/portal-shell/components/navigation/nav-main'
import { NavSecondary } from '@/features/shared/portal-shell/components/navigation/nav-secondary'
import { NavUser } from '@/features/shared/portal-shell/components/navigation/nav-user'
import { getMenuForUser } from '@/lib/menu/get-menu-for-user'
import { verifySession } from '@/lib/auth/session'

export async function AdminSidebar() {
  const session = await verifySession()

  if (!session) {
    return null
  }

  const menu = await getMenuForUser('admin', session)

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
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin Console</span>
                  <span className="truncate text-xs text-muted-foreground">Platform</span>
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
        <NavUser user={userData} portal="admin" />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
