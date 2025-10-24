import { PortalSidebar } from './portal-sidebar'
import type { PortalSidebarProps } from './portal-sidebar'
import type { FavoriteItem } from '@/features/shared/portal-shell/types'
import { getMenuForUser } from '@/lib/menu/get-menu-for-user'
import { verifySession, type Session } from '@/lib/auth/session'
import { getCustomerFavoritesSummary } from '@/features/shared/customer-common/api/queries'
import { getUnreadNotificationsCount } from '@/features/shared/notifications/api/queries'

export interface PortalSidebarWrapperProps {
  portal: 'customer' | 'business' | 'staff' | 'admin'
  title: string
  subtitle?: string
  session?: Session | null
}

export async function PortalSidebarWrapper({
  portal,
  title,
  subtitle,
  session: initialSession,
}: PortalSidebarWrapperProps) {
  const session = initialSession ?? (await verifySession())

  let navMain: PortalSidebarProps['navMain'] = []
  let navSecondary: PortalSidebarProps['navSecondary'] = []
  let favorites: FavoriteItem[] | undefined

  const userData = session
    ? {
        name: session.user.user_metadata?.full_name || session.user.email || 'User',
        email: session.user.email || '',
        avatar: session.user.user_metadata?.avatar_url || null,
      }
    : {
        name: 'Guest',
        email: '',
        avatar: null,
      }

  if (session) {
    const menu = await getMenuForUser(portal)
    navMain = menu.navMain
    navSecondary = menu.navSecondary

    if (portal === 'customer') {
      const shortcuts = await getCustomerFavoritesSummary(session.user.id)
      favorites = shortcuts.map((shortcut) => ({
        name: shortcut.name,
        url: shortcut.url,
        icon: 'star' as const,
        salonId: shortcut.salonId,
      }))
    }

    // Add unread notification badge for staff portal
    if (portal === 'staff') {
      try {
        const unreadCount = await getUnreadNotificationsCount()
        if (unreadCount > 0) {
          navMain = navMain.map(item =>
            item.url === '/staff/notifications'
              ? { ...item, badge: unreadCount }
              : item
          )
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }
  }

  const sidebarProps: PortalSidebarProps = {
    portal,
    title,
    subtitle,
    navMain,
    navSecondary,
    favorites,
    user: userData,
  }

  return <PortalSidebar {...sidebarProps} />
}
