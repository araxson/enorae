import type { ActionTextConfig, ChainActionType } from './types'

/**
 * Get action text configuration based on action type
 */
export function getActionText(action: ChainActionType): ActionTextConfig {
  switch (action) {
    case 'verify':
      return { title: 'Verify Chain', description: 'This will mark the chain as verified.' }
    case 'unverify':
      return { title: 'Unverify Chain', description: 'This will mark the chain as unverified.' }
    case 'activate':
      return {
        title: 'Activate Chain',
        description: 'This will activate the chain and all its salons.',
      }
    case 'deactivate':
      return {
        title: 'Deactivate Chain',
        description: 'This will deactivate the chain and all its salons.',
      }
    case 'delete':
      return {
        title: 'Delete Chain',
        description: 'This will permanently delete the chain. This action cannot be undone.',
      }
    default:
      return { title: '', description: '' }
  }
}

/**
 * Validate reason input
 */
export function validateReason(reason: string): string | null {
  if (reason.trim().length < 10) {
    return 'Please provide a reason with at least 10 characters.'
  }
  return null
}
