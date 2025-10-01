import { createClient } from '@/lib/supabase/client'

export async function getWebhooks(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getWebhookLogs(webhookId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('webhook_logs')
    .select('*')
    .eq('webhook_id', webhookId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}