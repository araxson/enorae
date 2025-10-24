'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { NavMain } from '@/features/shared/portal-shell/components/navigation/nav-main'
import { NavSecondary } from '@/features/shared/portal-shell/components/navigation/nav-secondary'
import { NavUser } from '@/features/shared/portal-shell/components/navigation/nav-user'
import { NavFavorites } from '@/features/shared/portal-shell/components/navigation/nav-favorites'
import type { NavItem, NavSecondaryItem, FavoriteItem } from '@/features/shared/portal-shell/types'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export interface PortalSidebarProps extends React.ComponentProps<typeof Sidebar> {
  portal: 'customer' | 'business' | 'staff' | 'admin'
  title: string
  subtitle?: string
  navMain: NavItem[]
  navSecondary?: NavSecondaryItem[]
  favorites?: FavoriteItem[]
  user: {
    name: string
    email: string
    avatar: string | null
    role?: string
  }
}

export function PortalSidebar({
  portal,
  title,
  subtitle,
  navMain,
  navSecondary,
  favorites,
  user,
  ...props
}: PortalSidebarProps) {
  const pathname = usePathname()

  // Add isActive state to nav items based on current pathname
  const navMainWithActive = navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url)),
  }))

  // Set portal-specific subtitles if not provided
  const displaySubtitle = subtitle || {
    customer: 'Customer Portal',
    business: 'Business Dashboard',
    staff: 'Staff Portal',
    admin: 'Admin Console'
  }[portal]

  return (
    <Sidebar
      collapsible="icon"
      className="border-r"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/${portal}`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{title}</span>
                  <span className="truncate text-xs text-muted-foreground">{displaySubtitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-0">
        {/* Main Navigation */}
        <NavMain items={navMainWithActive} />

        {/* Favorites (for customer portal) */}
        {portal === 'customer' && favorites && favorites.length > 0 && (
          <NavFavorites favorites={favorites} />
        )}

        {/* Secondary Navigation (Support, Settings, etc.) */}
        {navSecondary && navSecondary.length > 0 && (
          <NavSecondary items={navSecondary} className="mt-auto" />
        )}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <NavUser user={user} portal={portal} />
      </SidebarFooter>
    </Sidebar>
  )
}
