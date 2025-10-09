'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth'

import { UUID_REGEX } from './constants'

export async function deleteUserPermanently(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    await requireAnyRole(['super_admin'])
    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .schema('identity')
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
}
