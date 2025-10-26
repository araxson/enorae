/**
 * Core Application Constants
 *
 * DEPRECATED: This file is deprecated. Import from @/lib/config instead.
 *
 * @deprecated Use @/lib/config for all configuration values
 */

import { env } from '@/lib/env'
import {
  APP_METADATA,
  PLATFORM_SOCIAL_URLS,
  PLATFORM_CONTACT,
} from '@/lib/config/constants'

/**
 * @deprecated Import APP_METADATA from @/lib/config instead
 */
export const APP_NAME = APP_METADATA.name

/**
 * @deprecated Import APP_METADATA from @/lib/config instead
 */
export const APP_DESCRIPTION = APP_METADATA.description

/**
 * @deprecated Import ENV from @/lib/config instead
 */
export const APP_URL = env.NEXT_PUBLIC_APP_URL ?? env.NEXT_PUBLIC_SITE_URL

/**
 * @deprecated Import APP_METADATA from @/lib/config instead
 */
export const APP_VERSION = APP_METADATA.version

/**
 * @deprecated Import PLATFORM_SOCIAL_URLS from @/lib/config instead
 */
export const SOCIAL_LINKS = PLATFORM_SOCIAL_URLS

/**
 * @deprecated Import PLATFORM_CONTACT from @/lib/config instead
 */
export const CONTACT_EMAIL = PLATFORM_CONTACT.email

/**
 * @deprecated Import PLATFORM_CONTACT from @/lib/config instead
 */
export const SUPPORT_EMAIL = PLATFORM_CONTACT.support
