/**
 * Admin moderation constants
 * Shared constants that can be imported by both server and client code
 */

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const MODERATION_PATHS = ['/admin/moderation'] as const
