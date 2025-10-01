import { createClient } from '@/lib/supabase/client'

export async function getConversations(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(
        id,
        full_name,
        avatar_url
      ),
      receiver:receiver_id(
        id,
        full_name,
        avatar_url
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Group by conversation
  const conversations: Record<string, any> = {}

  ;(data as any[])?.forEach((message: any) => {
    const otherId = message.sender_id === userId ? message.receiver_id : message.sender_id
    if (!conversations[otherId]) {
      conversations[otherId] = {
        otherId,
        otherUser: message.sender_id === userId ? message.receiver : message.sender,
        lastMessage: message,
        unreadCount: message.receiver_id === userId && !message.read_at ? 1 : 0
      }
    }
  })

  return Object.values(conversations)
}

export async function getMessages(conversationId: string, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(
        id,
        full_name,
        avatar_url
      )
    `)
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const supabase = await createClient()

  const { error } = await (supabase as any)
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('sender_id', conversationId)
    .eq('receiver_id', userId)
    .is('read_at', null)

  if (error) throw error
}