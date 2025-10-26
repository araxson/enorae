'use server'

// Types
export type { ActionResponse, ThreadMetadata } from './types'

// Messaging operations
export { messageClient } from './messaging'

// Notes operations
export { addClientNote } from './notes'

// Preferences operations
export { updateClientPreferences } from './preferences'
