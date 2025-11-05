/**
 * Platform Contact and Social Media Configuration
 *
 * ENORAE platform-level contact information and social media links.
 * Note: Individual salon/user social media links come from database.
 */

/**
 * External URLs and Social Media
 *
 * Note: These are ENORAE platform social media links.
 * Individual salon/user social media links come from database.
 */
export const PLATFORM_SOCIAL_URLS = {
  twitter: 'https://twitter.com/enorae',
  facebook: 'https://facebook.com/enorae',
  instagram: 'https://instagram.com/enorae',
  linkedin: 'https://linkedin.com/company/enorae',
} as const

/**
 * Contact Information
 */
export const PLATFORM_CONTACT = {
  email: 'hello@enorae.com',
  support: 'support@enorae.com',
} as const

/**
 * Social Media Platforms Configuration
 * Used for form placeholders and validation
 */
export const SOCIAL_MEDIA_PLATFORMS = [
  {
    id: 'facebook',
    label: 'Facebook',
    placeholder: 'https://facebook.com/yourprofile',
    icon: 'Facebook',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    placeholder: 'https://instagram.com/yourprofile',
    icon: 'Instagram',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    placeholder: 'https://twitter.com/yourprofile',
    icon: 'Twitter',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/yourprofile',
    icon: 'Linkedin',
  },
] as const
