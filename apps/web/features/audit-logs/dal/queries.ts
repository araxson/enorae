import { createClient } from '@/lib/supabase/client'

export async function getAuditLogs(salonId?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let query = supabase
    .from('audit_logs')
    .select(`
      *,
      profiles!user_id(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (salonId) {
    query = query.eq('resource_id', salonId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}