import { z } from 'zod'

// Schema for portal shell navigation items
type NavItem = {
  title: string
  url: string
  icon?: string
  isActive?: boolean
  items?: NavItem[]
}

export const navItemSchema: z.ZodType<NavItem> = z.object({
  title: z.string(),
  url: z.string(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  items: z.array(z.lazy(() => navItemSchema)).optional(),
})

export const navSecondaryItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  icon: z.string().optional(),
})

export const favoriteItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  icon: z.string().optional(),
})

export const portalSidebarPropsSchema = z.object({
  navMain: z.array(navItemSchema).optional(),
  navSecondary: z.array(navSecondaryItemSchema).optional(),
  favorites: z.array(favoriteItemSchema).optional(),
})
