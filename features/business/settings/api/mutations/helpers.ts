'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { UUID_REGEX } from '@/lib/utils/validation'

export const salonIdSchema = z.string().regex(UUID_REGEX)

export async function getSalonContext(salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!UUID_REGEX.test(salonId)) {
    throw new Error('Invalid salon ID format')
  }

  const supabase = await createClient()

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  return supabase
}

export function revalidateSettings() {
  revalidatePath('/business/settings')
  revalidatePath('/business/dashboard')
}
