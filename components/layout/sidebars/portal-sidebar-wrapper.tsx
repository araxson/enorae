import { PortalSidebar } from './portal-sidebar'
import type { PortalSidebarProps } from './portal-sidebar'
import type { FavoriteItem } from './types'
import { getMenuForUser } from '@/lib/menu/get-menu-for-user'
import { verifySession, type Session } from '@/lib/auth/session'
import { getUserFavorites } from '@/features/customer/favorites/api/queries'

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
      const rawFavorites = await getUserFavorites()
      favorites = rawFavorites.map((favorite) => {
        const slugOrId = favorite.salon?.slug ?? favorite.salon_id ?? ''
        const url = slugOrId ? `/customer/salons/${slugOrId}` : '/customer/favorites'

        return {
          name: favorite.salon?.name ?? 'Favorite Salon',
          url,
          icon: 'star',
          salonId: favorite.salon_id ?? undefined,
        }
      })
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
