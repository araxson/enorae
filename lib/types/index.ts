/**
 * Type exports for ENORAE application
 *
 * Re-exports database types and common application types
 */

import type { Database as GeneratedDatabase } from './database.types'

export type { Database, Json, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes } from './database.types'

// User role type from identity schema
export type UserRole = GeneratedDatabase['identity']['Tables']['user_roles']['Row']
