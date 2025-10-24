import type { Database } from '@/lib/types/database.types'
import type { User } from '@supabase/supabase-js'
import type { createClient } from '@/lib/supabase/server'

export type Session = Database['public']['Views']['sessions']['Row']

export type SessionWithMetadata = Session & {
  is_current: boolean
}

export type SessionWithDevice = SessionWithMetadata

export interface SessionContext {
  supabase: Awaited<ReturnType<typeof createClient>>
  user: User
}

export interface SessionCardProps {
  session: SessionWithDevice
  onRevoke: (sessionId: string) => void
  isRevoking: boolean
}
