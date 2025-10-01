'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'

export async function createWebhook(salonId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('webhooks')
    .insert({
      salon_id: salonId,
      url: formData.get('url') as string,
      events: formData.getAll('events') as string[],
      is_active: true,
      secret: crypto.randomUUID(),
    })

  if (error) throw error
  revalidatePath('/business/settings/webhooks')
}

export async function toggleWebhook(webhookId: string, isActive: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('webhooks')
    .update({ is_active: isActive })
    .eq('id', webhookId)

  if (error) throw error
  revalidatePath('/business/settings/webhooks')
}