/**
 * Default brand color constants
 * Use these for consistent default branding across the application
 */

export const DEFAULT_BRAND_COLORS = {
  PRIMARY: '#000000',
  SECONDARY: '#ffffff',
  ACCENT: '#ff0000',
} as const

export type BrandColorKey = keyof typeof DEFAULT_BRAND_COLORS
