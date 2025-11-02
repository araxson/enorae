import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Location type enumeration
 */
export const locationTypeEnum = z.enum(['main', 'branch', 'mobile', 'home_service', 'popup'])


/**
 * Address validation schema
 * Standard address format used across the platform
 */
export const addressSchema = z.object({
  street_address: z
    .string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address is too long'),
  address_line_2: z.string().max(200, 'Address line 2 is too long').optional().or(z.literal('')),
  city: z.string().min(2, 'City name must be at least 2 characters').max(100, 'City name is too long'),
  state: z.string().min(2, 'State/Province must be at least 2 characters').max(100, 'State name is too long'),
  postal_code: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code is too long')
    .regex(/^[A-Z0-9\s-]+$/i, 'Postal code can only contain letters, numbers, spaces, and hyphens'),
  country: z
    .string()
    .length(2, 'Country must be a 2-letter code (e.g., US, CA, GB)')
    .regex(/^[A-Z]{2}$/i, 'Country must be uppercase 2-letter code')
    .transform((val) => val.toUpperCase()),
  latitude: z.coerce
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  longitude: z.coerce
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
})

/**
 * Location (salon branch) schema
 * Validates location details including address, contact info, and settings
 */
export const locationSchema = z.object({
  name: z
    .string()
    .min(3, 'Location name must be at least 3 characters')
    .max(200, 'Location name is too long'),
  location_type: locationTypeEnum.default('branch'),
  is_active: z.boolean().default(true),
  is_primary: z.boolean().default(false),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Enter a valid phone number (E.164 format)')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  website_url: z.string().url('Enter a valid website URL').max(200, 'URL is too long').optional().or(z.literal('')),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer').optional(),

  // Embed address fields
  street_address: z.string().min(5, 'Street address is required').max(200, 'Address is too long'),
  address_line_2: z.string().max(200, 'Address line 2 is too long').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required').max(100, 'City name is too long'),
  state: z.string().min(2, 'State/Province is required').max(100, 'State name is too long'),
  postal_code: z.string().min(3, 'Postal code is required').max(20, 'Postal code is too long'),
  country: z
    .string()
    .length(2, 'Country must be a 2-letter code')
    .transform((val) => val.toUpperCase()),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),

  // Operational settings
  timezone: z.string().min(1, 'Timezone is required').optional(),
  accepts_walk_ins: z.boolean().default(true),
  accepts_online_bookings: z.boolean().default(true),
  parking_available: z.boolean().default(false),
  wheelchair_accessible: z.boolean().default(false),

  // Staff and capacity
  max_staff_capacity: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 staff member')
    .max(100, 'Capacity seems too high')
    .optional(),
  max_simultaneous_appointments: z.coerce
    .number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 appointment')
    .max(100, 'Limit seems too high')
    .optional(),

  notes: z.string().max(500, 'Notes must be 500 characters or fewer').optional(),
}).refine(
  (data) => {
    // If latitude is provided, longitude must also be provided (and vice versa)
    if ((data.latitude === undefined) !== (data.longitude === undefined)) {
      return false
    }
    return true
  },
  {
    message: 'Both latitude and longitude must be provided together',
    path: ['latitude'],
  }
)

/**
 * Bulk location update schema
 * For updating multiple locations at once
 */
export const bulkLocationUpdateSchema = z.object({
  location_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid location ID'))
    .min(1, 'Select at least one location'),
  updates: z.object({
    is_active: z.boolean().optional(),
    accepts_online_bookings: z.boolean().optional(),
    accepts_walk_ins: z.boolean().optional(),
    timezone: z.string().optional(),
  }),
})

/**
 * Location search/filter schema
 * For finding locations by various criteria
 */
export const locationSearchSchema = z.object({
  query: z.string().max(200, 'Search query is too long').optional(),
  city: z.string().max(100, 'City name is too long').optional(),
  state: z.string().max(100, 'State name is too long').optional(),
  country: z.string().length(2, 'Country must be a 2-letter code').optional(),
  location_type: locationTypeEnum.optional(),
  is_active: z.boolean().optional(),
  accepts_online_bookings: z.boolean().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius_km: z.coerce
    .number()
    .min(1, 'Radius must be at least 1 km')
    .max(100, 'Radius cannot exceed 100 km')
    .optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type AddressSchema = z.infer<typeof addressSchema>
export type LocationSchema = z.infer<typeof locationSchema>
export type BulkLocationUpdateSchema = z.infer<typeof bulkLocationUpdateSchema>
export type LocationSearchSchema = z.infer<typeof locationSearchSchema>
