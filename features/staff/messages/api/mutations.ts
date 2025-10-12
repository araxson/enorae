'use server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { messageSchema, threadMessageSchema, type MessageFormData, type ThreadMessageFormData } from '../schema'

export async function sendMessage(data: MessageFormData) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const validated = messageSchema.parse(data)

  const supabase = await createClient()

  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .insert({
      from_user_id: session.user.id,
      to_user_id: validated.to_user_id,
      content: validated.content,
      context_type: validated.context_type,
      context_id: validated.context_id,
      is_read: false,
      is_edited: false,
      is_deleted: false,
    })

  if (error) throw error

  revalidatePath('/staff/messages')
}

export async function sendThreadMessage(threadId: string, data: ThreadMessageFormData) {
  const session = await verifySession()
  if (!session) throw new Error('Unauthorized')

  const validated = threadMessageSchema.parse(data)

  const supabase = await createClient()

  // Get thread details to find recipient
  const { data: thread, error: threadError } = await supabase
    .from('message_threads')
    .select('staff_id, customer_id')
    .eq('id', threadId)
    .single<{ staff_id: string | null; customer_id: string | null }>()

  if (threadError || !thread) throw new Error('Thread not found')

  if (thread.staff_id !== session.user.id) {
    throw new Error('Unauthorized to send message in this thread')
  }

  if (!thread.customer_id) throw new Error('Invalid thread configuration')

  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .insert({
      from_user_id: session.user.id,
      to_user_id: thread.customer_id,
      content: validated.content,
      context_type: 'general',
      is_read: false,
      is_edited: false,
      is_deleted: false,
    })

  if (error) throw error

  revalidatePath(`/staff/messages/${threadId}`)
  revalidatePath('/staff/messages')
}

export async function markThreadAsRead(threadId: string) {
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

  // Mark all messages in thread as read
  const { error } = await supabase
    .schema('communication')
    .from('messages')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('to_user_id', session.user.id)
    .eq('is_read', false)

  if (error) throw error

  revalidatePath(`/staff/messages/${threadId}`)
  revalidatePath('/staff/messages')
}

export async function archiveThread(threadId: string) {
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

  const { error } = await supabase
    .schema('communication')
    .from('message_threads')
    .update({
      status: 'archived',
      updated_at: new Date().toISOString(),
    })
    .eq('id', threadId)

  if (error) throw error

  revalidatePath('/staff/messages')
}
