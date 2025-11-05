/**
 * Safe JSON parsing with error handling
 * Prevents runtime errors from invalid JSON
 *
 * WARNING: This function casts the parsed value to T without validation.
 * The caller is responsible for validating that the parsed JSON matches type T.
 * For type-safe parsing, use safeJsonParseWithValidation() with a type guard instead.
 *
 * @example
 * // UNSAFE - No validation of parsed structure
 * const data = safeJsonParse<MyType>(json, defaultValue)
 *
 * // SAFE - With validation
 * const data = safeJsonParseWithValidation(json, isMyType, defaultValue)
 */

export function safeJsonParse<T = unknown>(json: string, fallback: T): T {
  try {
    const parsed: unknown = JSON.parse(json)
    return parsed as T
  } catch (error: unknown) {
    console.warn(
      `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    return fallback
  }
}

/**
 * Parse JSON with type guard validation
 */
export function safeJsonParseWithValidation<T = unknown>(
  json: string,
  validator: (value: unknown) => value is T,
  fallback: T,
): T {
  try {
    const parsed = JSON.parse(json)
    return validator(parsed) ? parsed : fallback
  } catch (error: unknown) {
    console.warn(
      `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    return fallback
  }
}

/**
 * Type guard for string arrays
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/**
 * Type guard for object with string keys
 */
export function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.entries(value).every(([, v]) => typeof v === 'string')
  )
}

/**
 * Parse and validate JSON as string array
 */
export function safeJsonParseStringArray(json: string, fallback: string[] = []): string[] {
  return safeJsonParseWithValidation(json, isStringArray, fallback)
}

/**
 * Parse and validate JSON as object/record
 */
export function safeJsonParseObject<T extends Record<string, unknown>>(
  json: string,
  fallback: T,
): T {
  try {
    const parsed = JSON.parse(json)
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as T)
      : fallback
  } catch (error: unknown) {
    return fallback
  }
}
