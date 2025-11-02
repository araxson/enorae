import 'server-only'
import { UUID_REGEX as UUID_PATTERN } from '@/lib/validations/patterns'

/**
 * Admin moderation constants
 * Shared constants that can be imported by both server and client code
 */

export const UUID_REGEX = UUID_PATTERN
export const MODERATION_PATHS = ['/admin/moderation'] as const
