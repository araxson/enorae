/**
 * Booking helpers - Server action helpers
 *
 * This file previously re-exported utility functions, but has been simplified.
 * Import utility functions directly from './utils' instead.
 */

// NOTE: This file is intentionally minimal. It previously had 'use server' directive
// and re-exported functions from utils.ts, but Turbopack doesn't allow re-exporting
// non-async functions from 'use server' files.
//
// To use generateConfirmationCode, import directly from './utils':
// import { generateConfirmationCode } from './utils'
