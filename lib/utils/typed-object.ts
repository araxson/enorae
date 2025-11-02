/**
 * Type-safe Object utility functions
 * Use these instead of direct Object.keys/entries to maintain type safety
 */

/**
 * Check if an object has any keys
 * @param obj - The object to check
 * @returns true if the object has at least one key
 */
export function hasKeys<T extends Record<string, unknown>>(obj: T): boolean {
  return Object.keys(obj).length > 0
}

/**
 * Type-safe Object.entries
 * @param obj - The object to get entries from
 * @returns Array of [key, value] tuples with proper typing
 */
export function objectEntries<T extends Record<string, unknown>>(
  obj: T
): Array<[string, T[keyof T]]> {
  return Object.entries(obj) as Array<[string, T[keyof T]]>
}

/**
 * Type-safe Object.keys
 * @param obj - The object to get keys from
 * @returns Array of keys with proper typing
 */
export function objectKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}
