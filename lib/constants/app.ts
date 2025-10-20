import { env } from '@/lib/env'

/**
 * Core Application Constants
 *
 * Application metadata, branding, contact information
 */

/**
 * Application Metadata
 */
export const APP_NAME = 'Enorae'
export const APP_DESCRIPTION = 'Modern salon booking platform with role-based portals for customers, staff, business owners, and platform administrators.'
export const APP_URL = env.NEXT_PUBLIC_APP_URL ?? env.NEXT_PUBLIC_SITE_URL

/**
 * Application Version
 */
export const APP_VERSION = '1.0.0'

/**
 * Social Media Links
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/enorae',
  facebook: 'https://facebook.com/enorae',
  instagram: 'https://instagram.com/enorae',
  linkedin: 'https://linkedin.com/company/enorae',
} as const

/**
 * Contact Information
 */
export const CONTACT_EMAIL = 'hello@enorae.com'
export const SUPPORT_EMAIL = 'support@enorae.com'
