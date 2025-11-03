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
import { NavMain, NavSecondary, NavUser, NavFavorites } from '..'
import { getMenuForUser } from '../../menu/get-menu-for-user'
import { verifySession } from '@/lib/auth/session'
import { getCustomerFavoritesSummary } from '@/features/shared/customer-common/api/queries'
import type { FavoriteItem } from '@/features/shared/portal-shell/api/types'

export async function CustomerSidebar() {
  const session = await verifySession()

  if (!session) {
    return null
  }

  const menu = await getMenuForUser('customer', session)

  // Get customer favorites
  let favorites: FavoriteItem[] = []
  try {
    const shortcuts = await getCustomerFavoritesSummary(session.user['id'])
    favorites = shortcuts.map((shortcut) => ({
      name: shortcut['name'],
      url: shortcut.url,
      icon: 'star' as const,
      salonId: shortcut.salonId,
    }))
  } catch (error) {
    console.error('Error fetching favorites:', error)
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
              <Link href="/customer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Customer Portal</span>
                  <span className="truncate text-xs text-muted-foreground">Explore</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <NavMain items={menu.navMain} />

        {/* Customer-specific: Favorites */}
        {favorites.length > 0 && <NavFavorites favorites={favorites} />}

        {/* Secondary Navigation (Support, Settings, etc.) */}
        {menu.navSecondary && menu.navSecondary.length > 0 && (
          <NavSecondary items={menu.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} portal="customer" />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
