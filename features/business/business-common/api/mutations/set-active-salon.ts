'use server'

import { revalidatePath } from 'next/cache'
import {
  requireAnyRole,
  setActiveSalonId,
  ROLE_GROUPS,
} from '@/lib/auth'

export async function setActiveSalon(formData: FormData) {
  const salonId = formData.get('salonId')
  if (typeof salonId !== 'string' || salonId.length === 0) {
    return
  }

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  await setActiveSalonId(salonId)

  revalidatePath('/business', 'page')
  revalidatePath('/staff', 'page')
}
