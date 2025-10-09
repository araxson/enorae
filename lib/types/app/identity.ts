import type { Database } from '../database.types'

export type ProfileMetadata = Database['public']['Views']['profiles_metadata']['Row']
export type ProfilePreference = Database['public']['Views']['profiles_preferences']['Row']
