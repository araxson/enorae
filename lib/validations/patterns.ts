/**
 * Validation regex patterns
 * Consolidates validation patterns used across multiple schemas
 */

// Phone number validation (E.164 format)
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/

// Email validation (basic pattern)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password strength (8+ chars, uppercase, lowercase, number, special char)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

// UUID validation
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Slug validation (lowercase alphanumeric with hyphens)
export const SLUG_REGEX = /^[a-z0-9-]+$/

// Hex color validation
export const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i

// Locale format (e.g., en-US)
export const LOCALE_REGEX = /^[a-z]{2}-[A-Z]{2}$/

// OTP validation (6 digits)
export const OTP_REGEX = /^\d{6}$/

// Time format (HH:MM)
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

// URL validation (basic)
export const URL_REGEX = /^https?:\/\/.+/

/**
 * Password validation breakdown (for granular error messages)
 */
export const PASSWORD_PATTERNS = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  digit: /\d/,
  special: /[@$!%*?&#]/,
} as const
