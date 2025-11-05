/**
 * Address Validation Configuration
 *
 * Configuration for address validation scoring and penalties.
 */

/**
 * Address Validation Configuration
 */
export const ADDRESS_VALIDATION = {
  /** Minimum score for valid address (0-100) */
  VALID_THRESHOLD: 70,
  /** Minimum score for acceptable address (0-100) */
  ACCEPTABLE_THRESHOLD: 50,
  /** Score penalties for missing fields */
  PENALTIES: {
    MISSING_STREET: 30,
    MISSING_CITY: 20,
    MISSING_STATE: 20,
    MISSING_POSTAL_CODE: 15,
    MISSING_COORDINATES: 10,
    MISSING_FORMATTED_ADDRESS: 5,
    INVALID_POSTAL_CODE: 10,
  },
} as const
