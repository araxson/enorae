import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import type { Session } from '@/lib/auth'

export async function getSupabaseClient() {
  return createClient()
}

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

type AssertSalonAccessOptions = {
  skipAccessCheck?: boolean
}

export async function assertSalonAccess(
  serviceId: string,
  supabase?: SupabaseServerClient,
  options: AssertSalonAccessOptions = {},
) {
  const client = supabase ?? (await getSupabaseClient())

  const { data: serviceOwner, error } = await client
    .schema('catalog')
    .from('services')
    .select('salon_id')
    .eq('id', serviceId)
    .maybeSingle<{ salon_id: string | null }>()

  if (error) throw error
  if (
    !serviceOwner?.salon_id ||
    (!options.skipAccessCheck && !(await canAccessSalon(serviceOwner.salon_id)))
  ) {
    throw new Error('Unauthorized: Not your service')
  }

  return { supabase: client, salonId: serviceOwner.salon_id }
}

export async function generateUniqueServiceSlug(
  supabase: SupabaseServerClient,
  salonId: string,
  name: string,
  excludeServiceId?: string,
): Promise<string> {
  const baseSlug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'service'

  const { data, error } = await supabase
    .schema('catalog')
    .from('services')
    .select('id, slug')
    .eq('salon_id', salonId)
    .ilike('slug', `${baseSlug}%`)

  if (error) throw error

  const existingSlugs = new Set(
    (data ?? [])
      .filter((row): row is { id: string; slug: string } => Boolean(row?.slug))
      .filter((row) => row.id !== excludeServiceId)
      .map((row) => row.slug),
  )

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  let candidate = `${baseSlug}-${suffix}`
  while (existingSlugs.has(candidate)) {
    suffix += 1
    candidate = `${baseSlug}-${suffix}`
  }

  return candidate
}

export async function ensureBusinessUser(): Promise<Session> {
  return requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
}
