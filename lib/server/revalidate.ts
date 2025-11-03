/**
 * Centralized Revalidation Utilities
 *
 * Eliminates repeated revalidatePath calls with consistent patterns
 *
 * Usage in mutation files:
 * ```ts
 * 'use server'
 * import { revalidateFeature } from '@/lib/server/revalidate'
 *
 * export async function updateSalon(data: FormData) {
 *   // ... mutation logic
 *   await revalidateFeature('salons')
 * }
 * ```
 */

'use server'
import { revalidatePath } from 'next/cache'

type Portal = 'admin' | 'business' | 'staff' | 'customer' | 'marketing'
type Feature =
  | 'dashboard'
  | 'appointments'
  | 'services'
  | 'staff'
  | 'salons'
  | 'users'
  | 'reviews'
  | 'analytics'
  | 'settings'
  | 'profile'
  | 'messages'
  | 'notifications'
  | 'coupons'
  | 'media'
  | 'locations'
  | 'chains'
  | 'roles'
  | 'webhooks'
  | 'transactions'
  | 'booking'
  | 'favorites'
  | 'loyalty'
  | 'discovery'

/**
 * Revalidate a specific feature across all portals
 */
export async function revalidateFeature(feature: Feature): Promise<void> {
  const portals: Portal[] = ['admin', 'business', 'staff', 'customer']

  for (const portal of portals) {
    revalidatePath(`/${portal}/${feature}`)
  }
}

/**
 * Revalidate a specific portal's feature
 */
export async function revalidatePortalFeature(
  portal: Portal,
  feature: Feature
): Promise<void> {
  revalidatePath(`/${portal}/${feature}`)
}

/**
 * Revalidate multiple features at once
 */
export async function revalidateFeatures(features: Feature[]): Promise<void> {
  const promises = features.map(feature => revalidateFeature(feature))
  await Promise.all(promises)
}

/**
 * Revalidate all dashboards across portals
 */
export async function revalidateDashboards(): Promise<void> {
  revalidatePath('/admin/dashboard')
  revalidatePath('/business/dashboard')
  revalidatePath('/staff/dashboard')
  revalidatePath('/customer/dashboard')
}

/**
 * Revalidate a custom path with optional type
 */
export async function revalidateCustomPath(
  path: string,
  type: 'page' | 'layout' = 'page'
): Promise<void> {
  revalidatePath(path, type)
}

/**
 * Revalidate multiple custom paths
 */
export async function revalidateCustomPaths(paths: string[]): Promise<void> {
  paths.forEach(path => revalidatePath(path))
}
