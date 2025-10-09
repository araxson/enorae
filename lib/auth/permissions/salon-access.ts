'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { env } from '@/lib/env'

import { verifySession } from '../session'
import { ROLE_GROUPS } from './roles'

export type SalonContext = {
  activeSalonId: string | null
  accessibleSalonIds: string[]
}

export async function getUserSalonIds(): Promise<string[]> {
  const session = await verifySession()
  if (!session) return []

  const supabase = await createClient()

  const [ownedSalonsResult, staffSalonsResult] = await Promise.all([
    supabase.from('salons').select('id').eq('owner_id', session.user.id),
    supabase
      .from('staff')
      .select('salon_id')
      .eq('user_id', session.user.id)
      .not('salon_id', 'is', null),
  ])

  if (ownedSalonsResult.error) throw ownedSalonsResult.error
  if (staffSalonsResult.error) throw staffSalonsResult.error

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

  return Array.from(ids)
}

export async function getSalonContext(): Promise<SalonContext> {
  const accessibleSalonIds = await getUserSalonIds()
  if (!accessibleSalonIds.length) {
    return { activeSalonId: null, accessibleSalonIds: [] }
  }

  const cookieStore = await cookies()
  const cookieSalonId = cookieStore.get('active_salon_id')?.value

  const activeSalonId = cookieSalonId && accessibleSalonIds.includes(cookieSalonId)
    ? cookieSalonId
    : accessibleSalonIds[0]

  return { activeSalonId, accessibleSalonIds }
}

export async function getUserSalonId(): Promise<string | null> {
  const session = await verifySession()
  if (!session) return null

  const { activeSalonId } = await getSalonContext()
  return activeSalonId
}

export async function setActiveSalonId(salonId: string): Promise<void> {
  const { accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length) {
    throw new Error('No salons available for current user')
  }

  if (!accessibleSalonIds.includes(salonId)) {
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
  if (!session) return false

  if (ROLE_GROUPS.PLATFORM_ADMINS.includes(session.role)) {
    return true
  }

  const supabase = await createClient()

  const { data: salonData } = await supabase
    .from('salons')
    .select('id')
    .eq('id', salonId)
    .eq('owner_id', session.user.id)
    .single()

  if (salonData) return true

  const { data: staffData } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('salon_id', salonId)
    .single()

  return Boolean(staffData)
}
