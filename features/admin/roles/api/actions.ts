'use server'

import { assignRole } from './mutations/assign-role'

type ActionState = {
  success: boolean
  message: string
  errors: Record<string, string[]>
}

export async function assignRoleAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const result = await assignRole(formData)

    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Failed to assign role',
        errors: {},
      }
    }

    return {
      success: true,
      message: 'Role assigned successfully',
      errors: {},
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      errors: {},
    }
  }
}
