import type { IconName } from './components/navigation/icon-map'

export interface NavItem {
  title: string
  url: string
  icon: IconName
  isActive?: boolean
  badge?: number
  items?: {
    title: string
    url: string
  }[]
}

export interface NavSecondaryItem {
  title: string
  url: string
  icon: IconName
  badge?: number
}

export interface FavoriteItem {
  name: string
  url: string
  icon: IconName
  salonId?: string
}

export interface PortalSidebarProps {
  navMain?: NavItem[]
  navSecondary?: NavSecondaryItem[]
  favorites?: FavoriteItem[]
}
