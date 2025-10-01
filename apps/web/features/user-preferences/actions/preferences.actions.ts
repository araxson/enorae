'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'

export async function updatePreferences(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const preferences = {
    email_notifications: formData.get('emailNotifications') === 'on',
    sms_notifications: formData.get('smsNotifications') === 'on',
    marketing_emails: formData.get('marketingEmails') === 'on',
    theme: formData.get('theme') as string,
    language: formData.get('language') as string,
  }

  const { error } = await (supabase as any)
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...preferences,
    })

  if (error) throw error
  revalidatePath('/profile/settings')
}