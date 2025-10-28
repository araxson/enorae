import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { MessageThread, Message } from '@/features/staff/messages/types'

async function resolveStaffId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle<{ id: string | null }>()

  if (error) throw error
  return data?.id ?? null
}

export async function getMyMessageThreads(): Promise<MessageThread[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const staffId = await resolveStaffId(supabase, user.id)
  if (!staffId) return []

  const { data, error } = await supabase
    .schema('communication')
    .from('message_threads')
    .select('*')
    .eq('staff_id', staffId)
    .order('last_message_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getThreadById(threadId: string): Promise<MessageThread | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const staffId = await resolveStaffId(supabase, user.id)
  if (!staffId) return null

  const { data, error } = await supabase
    .schema('communication')
    .from('message_threads')
    .select('*')
    .eq('id', threadId)
    .eq('staff_id', staffId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getThreadMessages(threadId: string): Promise<Message[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const staffId = await resolveStaffId(supabase, user.id)
  if (!staffId) throw new Error('Unauthorized')

  // Verify thread access
  const { data: thread } = await supabase
    .schema('communication')
    .from('message_threads')
    .select('staff_id')
    .eq('id', threadId)
    .single<{ staff_id: string | null }>()

  if (!thread || thread.staff_id !== staffId) {
    throw new Error('Unauthorized to access this thread')
  }

  const { data, error } = await supabase
    .schema('communication')
    .from('messages')
    .select('*')
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getUnreadCount(): Promise<number> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const staffId = await resolveStaffId(supabase, user.id)
  if (!staffId) return 0

  const { data, error } = await supabase
    .schema('communication')
    .from('message_threads')
    .select('unread_count_staff')
    .eq('staff_id', staffId)
    .returns<Array<Pick<MessageThread, 'unread_count_staff'>>>()

  if (error) throw error

  return data.reduce((sum, thread) => sum + (thread.unread_count_staff ?? 0), 0)
}
