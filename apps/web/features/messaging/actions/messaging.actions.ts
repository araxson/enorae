'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const receiverId = formData.get('receiverId') as string
  const content = formData.get('content') as string
  const salonId = formData.get('salonId') as string | null

  const { error } = await (supabase as any)
    .from('messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      salon_id: salonId,
      content,
      type: 'text',
    })

  if (error) throw error
  revalidatePath('/messages')
  revalidatePath(`/messages/${receiverId}`)
}

export async function deleteMessage(messageId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('messages')
    .delete()
    .eq('id', messageId)
    .eq('sender_id', user.id)

  if (error) throw error
  revalidatePath('/messages')
}