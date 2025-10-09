import type { User } from '@supabase/supabase-js'
import type { Session } from '@/lib/auth'

const DEFAULT_TIMESTAMP = '2025-01-01T00:00:00.000Z'

const baseUser: User = {
  id: 'user-1',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  email: 'owner@example.com',
  created_at: DEFAULT_TIMESTAMP,
  confirmed_at: DEFAULT_TIMESTAMP,
  email_confirmed_at: DEFAULT_TIMESTAMP,
  last_sign_in_at: DEFAULT_TIMESTAMP,
  role: 'authenticated',
  updated_at: DEFAULT_TIMESTAMP,
  identities: [],
  is_anonymous: false,
}

type SessionOverrides = Partial<Omit<Session, 'user'>> & {
  user?: Partial<User>
}

export function createSessionStub(overrides: SessionOverrides = {}): Session {
  const { user: userOverrides = {}, ...sessionOverrides } = overrides
  const user: User = { ...baseUser, ...userOverrides }

  return {
    user,
    role: sessionOverrides.role ?? 'salon_owner',
    ...sessionOverrides,
  }
}
