import 'server-only'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import type { MessageThread, Message } from '@/features/staff/messages/types'

export async function getMyMessageThreads(): Promise<MessageThread[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('message_threads')
    .select('*')
    .eq('staff_id', session.user.id)
    .order('last_message_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getThreadById(threadId: string): Promise<MessageThread | null> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('message_threads')
    .select('*')
    .eq('id', threadId)
    .eq('staff_id', session.user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getThreadMessages(threadId: string): Promise<Message[]> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()

  // Verify thread access
  const { data: thread } = await supabase
    .from('message_threads')
    .select('staff_id')
    .eq('id', threadId)
    .single<{ staff_id: string | null }>()

  if (!thread || thread.staff_id !== session.user.id) {
    throw new Error('Unauthorized to access this thread')
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`from_user_id.eq.${session.user.id},to_user_id.eq.${session.user.id}`)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getUnreadCount(): Promise<number> {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('message_threads')
    .select('unread_count_staff')
    .eq('staff_id', session.user.id)
    .returns<Array<Pick<MessageThread, 'unread_count_staff'>>>()

  if (error) throw error

  return data.reduce((sum, thread) => sum + (thread.unread_count_staff ?? 0), 0)
}
