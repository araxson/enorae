'use server'

import { createClient } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signupAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const userType = formData.get('userType') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: userType,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create profile in database
  if (data.user) {
    await (supabase as any).from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      user_type: userType,
    })
  }

  revalidatePath('/', 'layout')
  redirect(userType === 'business' ? '/business' : '/')
}

export async function logoutAction() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return user
}