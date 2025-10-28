'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('Logout initiated', {
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString()
    })

    await supabase.auth.signOut()

    console.log('Logout completed', {
      userId: user?.id,
      timestamp: new Date().toISOString()
    })

    redirect('/login')
  } catch (error) {
    console.error('Logout error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    redirect('/login')
  }
}
