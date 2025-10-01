'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'

export async function updateOperatingHours(salonId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dayOfWeek = Number(formData.get('dayOfWeek'))
  const openTime = formData.get('openTime') as string
  const closeTime = formData.get('closeTime') as string
  const isClosed = formData.get('isClosed') === 'true'

  const { error } = await (supabase as any)
    .from('operating_hours')
    .upsert({
      salon_id: salonId,
      day_of_week: dayOfWeek,
      open_time: isClosed ? null : openTime,
      close_time: isClosed ? null : closeTime,
      is_closed: isClosed,
    })

  if (error) throw error
  revalidatePath('/business/settings/hours')
}

export async function addSpecialHours(salonId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('special_hours')
    .insert({
      salon_id: salonId,
      date: formData.get('date') as string,
      open_time: formData.get('openTime') as string,
      close_time: formData.get('closeTime') as string,
      is_closed: formData.get('isClosed') === 'true',
      reason: formData.get('reason') as string,
    })

  if (error) throw error
  revalidatePath('/business/settings/hours')
}