import type { IconName } from '../navigation/icon-map'

export interface NavItem {
  title: string
  url: string
  icon: IconName
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface NavSecondaryItem {
  title: string
  url: string
  icon: IconName
}

export interface FavoriteItem {
  name: string
  url: string
  icon: IconName
  salonId?: string
}
