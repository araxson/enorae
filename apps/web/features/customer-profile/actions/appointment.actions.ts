'use server'

import { createClient } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function cancelAppointment(appointmentId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Update appointment status to cancelled
  const { error } = await (supabase as any)
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)
    .eq('customer_id', user.id) // Ensure user owns this appointment

  if (error) throw error

  revalidatePath('/profile')
}

export async function rescheduleAppointment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const appointmentId = formData.get('appointmentId') as string
  const newDate = formData.get('date') as string
  const newTime = formData.get('time') as string

  const startTime = new Date(`${newDate}T${newTime}:00`)
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // +1 hour

  const { error } = await (supabase as any)
    .from('appointments')
    .update({
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'pending',
    })
    .eq('id', appointmentId)
    .eq('customer_id', user.id)

  if (error) throw error

  revalidatePath('/profile')
}