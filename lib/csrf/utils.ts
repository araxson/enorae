/**
 * CSRF utilities - Pure helper functions
 *
 * NOTE: This file does NOT have 'use server' because these are utility functions
 * that can be imported by both server actions and server components.
 */

/**
 * Generate a new CSRF token
 *
 * This should be called on initial page load and set in both:
 * 1. HttpOnly cookie
 * 2. Meta tag or data attribute for client-side access
 *
 * @returns A cryptographically secure random token
 */
export function generateCSRFToken(): string {
  // Generate 32 bytes of random data (256 bits)
  const buffer = new Uint8Array(32)
  crypto.getRandomValues(buffer)

  // Convert to base64url (URL-safe base64)
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
