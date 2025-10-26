/**
 * API_INTEGRATION_FIX: Google Maps API response validation schemas
 *
 * Validates external API responses to ensure type safety
 */

import { z } from 'zod'

export const GoogleMapsAutocompleteResponseSchema = z.object({
  predictions: z
    .array(
      z.object({
        description: z.string(),
        place_id: z.string(),
      })
    )
    .optional(),
  status: z.string().optional(),
})

export const GoogleMapsGeocodeResponseSchema = z.object({
  results: z
    .array(
      z.object({
        formatted_address: z.string(),
        place_id: z.string(),
        geometry: z.object({
          location: z.object({
            lat: z.number(),
            lng: z.number(),
          }),
        }),
      })
    )
    .optional(),
  status: z.string().optional(),
})

export type GoogleMapsAutocompleteResponse = z.infer<typeof GoogleMapsAutocompleteResponseSchema>
export type GoogleMapsGeocodeResponse = z.infer<typeof GoogleMapsGeocodeResponseSchema>
