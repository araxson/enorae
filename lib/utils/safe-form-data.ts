/**
 * Safe FormData utilities with type-safe extraction
 * Prevents runtime errors from missing or invalid form fields
 */

/**
 * Get required string from FormData with validation
 */
export function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key)
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw new Error(`Missing required field: ${key}`)
  }
  return value.toString()
}

/**
 * Get optional string from FormData
 */
export function getOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key)
  if (!value) return null
  return value.toString()
}

/**
 * Get required integer from FormData
 */
export function getRequiredInt(formData: FormData, key: string): number {
  const value = getRequiredString(formData, key)
  const num = parseInt(value, 10)
  if (isNaN(num)) {
    throw new Error(`Invalid integer for field: ${key}`)
  }
  return num
}

/**
 * Get optional integer from FormData
 */
export function getOptionalInt(formData: FormData, key: string): number | null {
  const value = getOptionalString(formData, key)
  if (!value) return null
  const num = parseInt(value, 10)
  return isNaN(num) ? null : num
}

/**
 * Get required boolean from FormData
 */
export function getRequiredBoolean(formData: FormData, key: string): boolean {
  const value = getRequiredString(formData, key)
  return value === 'true' || value === '1' || value === 'on'
}

/**
 * Get optional boolean from FormData
 */
export function getOptionalBoolean(formData: FormData, key: string): boolean {
  const value = getOptionalString(formData, key)
  return value === 'true' || value === '1' || value === 'on'
}

/**
 * Get required JSON array from FormData
 *
 * VALIDATION: Checks that the parsed value is an array, but does NOT validate
 * that elements match type T. For complex element types, validate in calling code.
 *
 * @example
 * // ✅ SAFE - Simple types
 * const ids = getRequiredJsonArray<string>(formData, 'ids')
 *
 * // ⚠️ COMPLEX - Validate elements yourself
 * const items = getRequiredJsonArray<ComplexType>(formData, 'items')
 * items.forEach(item => validateComplexType(item))
 */
export function getRequiredJsonArray<T = unknown>(formData: FormData, key: string): T[] {
  const value = getRequiredString(formData, key)
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      throw new Error(`Field ${key} is not an array`)
    }
    return parsed as T[]
  } catch (error) {
    throw new Error(
      `Invalid JSON array for field ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Get optional JSON array from FormData
 *
 * VALIDATION: Checks that the parsed value is an array, but does NOT validate
 * that elements match type T. For complex element types, validate in calling code.
 */
export function getOptionalJsonArray<T = unknown>(
  formData: FormData,
  key: string,
  fallback: T[] = [],
): T[] {
  const value = getOptionalString(formData, key)
  if (!value) return fallback
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? (parsed as T[]) : fallback
  } catch (error) {
    console.warn(`Failed to parse JSON array for field ${key}`)
    return fallback
  }
}

/**
 * Get required JSON object from FormData
 *
 * VALIDATION: Checks that the parsed value is an object (not array, not null),
 * but does NOT validate object structure against T. Validate properties in calling code.
 */
export function getRequiredJsonObject<T extends Record<string, unknown>>(
  formData: FormData,
  key: string,
): T {
  const value = getRequiredString(formData, key)
  try {
    const parsed: unknown = JSON.parse(value)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error(`Field ${key} is not an object`)
    }
    return parsed as T
  } catch (error) {
    throw new Error(
      `Invalid JSON object for field ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Get optional JSON object from FormData
 *
 * VALIDATION: Checks that the parsed value is an object (not array, not null),
 * but does NOT validate object structure against T. Validate properties in calling code.
 */
export function getOptionalJsonObject<T extends Record<string, unknown>>(
  formData: FormData,
  key: string,
  fallback: T = {} as T,
): T {
  const value = getOptionalString(formData, key)
  if (!value) return fallback
  try {
    const parsed: unknown = JSON.parse(value)
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as T)
      : fallback
  } catch (error) {
    console.warn(`Failed to parse JSON object for field ${key}`)
    return fallback
  }
}
