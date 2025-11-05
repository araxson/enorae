/**
 * Application Metadata and SEO Configuration
 *
 * Application-level metadata and SEO constants.
 */

/**
 * Application Metadata
 */
export const APP_METADATA = {
  name: 'Enorae',
  version: '1.0.0',
  description:
    'Modern salon booking platform with role-based portals for customers, staff, business owners, and platform administrators.',
} as const

/**
 * Schema.org and SEO
 */
export const SEO_CONSTANTS = {
  /** Default image for salons without uploaded images */
  DEFAULT_SALON_IMAGE: '/default-salon.png',
  /** Rating scale for aggregate ratings */
  RATING_SCALE: {
    best: 5,
    worst: 1,
  },
  /** Default price range if not specified */
  DEFAULT_PRICE_RANGE: '$$',
} as const
