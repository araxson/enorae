import { createClient } from '@/lib/supabase/client'

export async function getUserPreferences() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || {
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: false,
    theme: 'light',
    language: 'en',
  }
}