'use server'

import { revalidatePath } from 'next/cache'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

import { UUID_REGEX, updateProfileSchema } from '../../constants'
import { createOperationLogger } from '@/lib/observability'

export async function updateUserProfile(formData: FormData): Promise<
  | { error: string; fieldErrors?: Record<string, string[] | undefined> }
  | { success: true }
> {
  const logger = createOperationLogger('updateUserProfile', {})
  logger.start()

  try {
    const userId = formData.get('userId')?.toString()
    if (!userId || !UUID_REGEX.test(userId)) {
      return { error: 'Invalid user ID' }
    }

    const result = updateProfileSchema.safeParse({
      username: formData.get('username')?.toString(),
      fullName: formData.get('fullName')?.toString(),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      return { error: firstError ?? 'Invalid form data', fieldErrors }
    }

    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const { username, fullName } = result.data

    if (username !== undefined) {
      const { error: profileError } = await supabase
        .schema('identity')
        .from('profiles')
        .update({
          username,
          updated_by_id: session.user.id,
        })
        .eq('id', userId)

      if (profileError) return { error: profileError.message }
    }

    if (fullName !== undefined) {
      const { error: metadataError } = await supabase
        .schema('identity')
        .from('profiles_metadata')
        .update({
          full_name: fullName,
        })
        .eq('profile_id', userId)

      if (metadataError) return { error: metadataError.message }
    }

    revalidatePath('/admin/users', 'page')
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}
