'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createOperationLogger, logMutation, logError } from '@/lib/observability/logger'

export async function logout(): Promise<void> {
  const logger = createOperationLogger('logout', {})

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    logger.start({ userId: user?.id, email: user?.email })

    console.log('Logout initiated', {
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString()
    })

    await supabase.auth.signOut()

    logger.success({ userId: user?.id })
    console.log('Logout completed', {
      userId: user?.id,
      timestamp: new Date().toISOString()
    })

    redirect('/login')
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'auth')
    console.error('Logout error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    redirect('/login')
  }
}
