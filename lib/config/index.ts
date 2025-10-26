/**
 * Configuration Module Exports
 *
 * Centralized configuration access point.
 * All configuration values should be imported from this module.
 */

// Environment variables and validation
export { ENV, SERVER_ENV, isGoogleMapsEnabled, getGoogleMapsApiKey, EXTERNAL_APIS } from './env'

// Application constants
export {
  TIME_MS,
  CACHE_DURATION,
  RATE_LIMITS,
  DATA_LIMITS,
  BUSINESS_THRESHOLDS,
  PLATFORM_SOCIAL_URLS,
  PLATFORM_CONTACT,
  APP_METADATA,
  SEO_CONSTANTS,
  SOCIAL_MEDIA_PLATFORMS,
  TIME_CONVERSIONS,
} from './constants'

// Google Maps API schemas
export {
  GoogleMapsAutocompleteResponseSchema,
  GoogleMapsGeocodeResponseSchema,
  type GoogleMapsAutocompleteResponse,
  type GoogleMapsGeocodeResponse,
} from './google-maps-schema'
