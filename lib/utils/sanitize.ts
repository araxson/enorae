/**
 * Input Sanitization Utilities
 *
 * Provides XSS prevention for user-generated content
 * Used in Server Actions to sanitize text inputs
 */

/**
 * Sanitize text input to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 *
 * @param input - Raw user input
 * @returns Sanitized plain text
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-like content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Sanitize review comment (allows basic formatting)
 * Strips dangerous HTML but preserves line breaks
 *
 * @param comment - Review comment text
 * @returns Sanitized comment
 */
export function sanitizeReviewComment(comment: string): string {
  if (typeof comment !== 'string') {
    return ''
  }

  // First remove all dangerous content
  const cleaned = comment
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')

  // Remove all HTML tags (reviews should be plain text)
  return cleaned
    .replace(/<[^>]*>/g, '')
    .trim()
}

/**
 * Check for spam patterns in user content
 * Returns true if content appears to be spam
 *
 * @param content - User input to check
 * @returns true if spam detected
 */
export function isSpamContent(content: string): boolean {
  const spamPatterns = [
    /\b(buy|cheap|discount|click here|visit|limited time|act now)\b/gi,
    /http[s]?:\/\//gi, // URLs
    /\b\d{10,}\b/gi, // Long numbers (phone/card)
    /\b(viagra|cialis|casino|lottery)\b/gi, // Common spam keywords
  ]

  return spamPatterns.some(pattern => pattern.test(content))
}
