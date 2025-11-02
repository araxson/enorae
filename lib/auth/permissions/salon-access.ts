'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

import { verifySession } from '@/lib/auth/session'
import { ROLE_GROUPS } from './roles'
import { logAuthEvent, logError, logInfo } from '@/lib/observability/logger'

export type SalonContext = {
  activeSalonId: string | null
  accessibleSalonIds: string[]
}

export async function getUserSalonIds(): Promise<string[]> {
  const session = await verifySession()
  if (!session) {
    logInfo('getUserSalonIds: No session', { operationName: 'getUserSalonIds' })
    return []
  }

  const supabase = await createClient()

  const [ownedSalonsResult, staffSalonsResult] = await Promise.all([
    supabase.from('salons_view').select('id').eq('owner_id', session.user.id),
    supabase
      .from('staff_profiles_view')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .not('salon_id', 'is', null),
  ])

  if (ownedSalonsResult.error) {
    logError('getUserSalonIds: Failed to fetch owned salons', {
      operationName: 'getUserSalonIds',
      userId: session.user.id,
      error: ownedSalonsResult.error,
    })
    throw ownedSalonsResult.error
  }

  if (staffSalonsResult.error) {
    logError('getUserSalonIds: Failed to fetch staff salons', {
      operationName: 'getUserSalonIds',
      userId: session.user.id,
      error: staffSalonsResult.error,
    })
    throw staffSalonsResult.error
  }

  const ownedSalonRows = (ownedSalonsResult.data ?? []) as Array<{ id: string | null }>
  const staffSalonRows = (staffSalonsResult.data ?? []) as Array<{ salon_id: string | null }>

  const ids = new Set<string>()

  for (const salon of ownedSalonRows) {
    if (salon?.id) {
      ids.add(salon.id)
    }
  }

  for (const staffSalon of staffSalonRows) {
    if (staffSalon?.salon_id) {
      ids.add(staffSalon.salon_id)
    }
  }

  const salonIds = Array.from(ids)

  logInfo('getUserSalonIds: Retrieved salon IDs', {
    operationName: 'getUserSalonIds',
    userId: session.user.id,
  })

  return salonIds
}

export async function getSalonContext(): Promise<SalonContext> {
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.length) {
    return { activeSalonId: null, accessibleSalonIds: [] }
  }

  const cookieStore = await cookies()
  const cookieSalonId = cookieStore.get('active_salon_id')?.value ?? null
  const fallbackSalonId =
    accessibleSalonIds.length > 0 ? accessibleSalonIds[0] ?? null : null

  const activeSalonId =
    cookieSalonId && accessibleSalonIds.includes(cookieSalonId)
      ? cookieSalonId
      : fallbackSalonId

  return { activeSalonId, accessibleSalonIds }
}

export async function getUserSalonId(): Promise<string | null> {
  const session = await verifySession()
  if (!session) return null

  const { activeSalonId } = await getSalonContext()
  return activeSalonId
}

export async function setActiveSalonId(salonId: string): Promise<void> {
  const session = await verifySession()
  const { accessibleSalonIds } = await getSalonContext()

  if (!accessibleSalonIds.length) {
    logError('setActiveSalonId: No salons available', {
      operationName: 'setActiveSalonId',
      userId: session?.user.id,
      error: 'No salons available',
      salonId,
    })
    throw new Error('No salons available for current user')
  }

  if (!accessibleSalonIds.includes(salonId)) {
    logAuthEvent('permission_check', {
      operationName: 'setActiveSalonId',
      userId: session?.user.id,
      salonId,
      reason: 'Unauthorized salon selection',
      success: false,
    })
    throw new Error('Unauthorized salon selection')
  }

  const cookieStore = await cookies()
  cookieStore.set('active_salon_id', salonId, {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  })

  logInfo('setActiveSalonId: Active salon changed', {
    operationName: 'setActiveSalonId',
    userId: session?.user.id,
    salonId,
  })
}

export async function clearActiveSalonId(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('active_salon_id', '', {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 0,
  })
}

export async function requireUserSalonId(): Promise<string> {
  const salonId = await getUserSalonId()

  if (!salonId) {
    throw new Error('No salon found. Please ensure your account is properly set up with a salon or contact support.')
  }

  return salonId
}

export async function canAccessSalon(salonId: string): Promise<boolean> {
  const session = await verifySession()
  if (!session) {
    logAuthEvent('permission_check', {
      operationName: 'canAccessSalon',
      salonId,
      reason: 'No session',
      success: false,
    })
    return false
  }

  if (ROLE_GROUPS.PLATFORM_ADMINS.includes(session.role)) {
    logAuthEvent('permission_check', {
      operationName: 'canAccessSalon',
      userId: session.user.id,
      salonId,
      reason: 'Platform admin access',
      success: true,
    })
    return true
  }

  const supabase = await createClient()

  const { data: salonData } = await supabase
    .from('salons_view')
    .select('id')
    .eq('id', salonId)
    .eq('owner_id', session.user.id)
    .single()

  if (salonData) {
    logAuthEvent('permission_check', {
      operationName: 'canAccessSalon',
      userId: session.user.id,
      salonId,
      reason: 'Salon owner',
      success: true,
    })
    return true
  }

  const { data: staffData } = await supabase
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('salon_id', salonId)
    .single()

  const hasAccess = Boolean(staffData)

  logAuthEvent('permission_check', {
    operationName: 'canAccessSalon',
    userId: session.user.id,
    salonId,
    reason: hasAccess ? 'Staff member' : 'No access',
    success: hasAccess,
  })

  return hasAccess
}
