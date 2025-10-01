'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'

export async function createBlockedTime(salonId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('blocked_times')
    .insert({
      salon_id: salonId,
      staff_id: formData.get('staffId') as string | null,
      start_time: formData.get('startTime') as string,
      end_time: formData.get('endTime') as string,
      reason: formData.get('reason') as string,
      recurring: formData.get('recurring') === 'true',
    })

  if (error) throw error
  revalidatePath('/business/schedule')
}