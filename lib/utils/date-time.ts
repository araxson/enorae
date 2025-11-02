/**
 * Comprehensive date and time formatting utilities for ENORAE
 * Consolidates all date/time formatting across the application
 */

import { format } from 'date-fns'

const NOON_HOUR = 12
const MIDNIGHT_HOUR = 0
const DISPLAY_NOON_HOUR = 12
const TIME_PART_PADDING_LENGTH = 2
const TIME_PART_PADDING_CHAR = '0'
const AM_INDICATOR = 'AM'
const PM_INDICATOR = 'PM'

/**
 * Format time from hour number to 12-hour format with AM/PM
 * Used for displaying business hours, schedules, etc.
 */
export function formatHourTo12Hour(hour: number, minute: number = 0): string {
  const ampm = hour >= NOON_HOUR ? PM_INDICATOR : AM_INDICATOR
  const displayHour = hour > NOON_HOUR ? hour - NOON_HOUR : hour === MIDNIGHT_HOUR ? DISPLAY_NOON_HOUR : hour
  const displayMinute = minute.toString().padStart(TIME_PART_PADDING_LENGTH, TIME_PART_PADDING_CHAR)
  return `${displayHour}:${displayMinute} ${ampm}`
}

/**
 * Format time from ISO string to localized time string
 * Used for displaying appointment times, etc.
 */
export function formatTimeFromISO(time: string | null): string {
  if (!time) return '-'
  return new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Format date to readable format (e.g., "Jan 15, 2024")
 * Handles null values gracefully
 */
export function formatDate(value: string | null): string {
  if (!value) return '—'
  try {
    return format(new Date(value), 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

/**
 * Format date to simple localized format
 * Used for calendar displays
 */
export function formatDateSimple(value: string): string {
  return new Date(value).toLocaleDateString()
}

/**
 * Format date and time together
 */
export function formatDateTime(value: string | null): string {
  if (!value) return '—'
  try {
    return format(new Date(value), 'MMM d, yyyy h:mm a')
  } catch {
    return '—'
  }
}

/**
 * Get day name from day string (e.g., "monday" -> "Monday")
 */
export function getDayName(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

/**
 * Format analytics date (shorter format for charts)
 */
export function formatAnalyticsDate(date: string | Date): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObject)
}

/**
 * Safely format a date string with error handling
 * Useful for displaying dates from database that might be invalid
 */
export function safeFormatDate(
  dateStr: string | null | undefined,
  formatStr: string = 'MMM d, yyyy',
  fallback: string = 'N/A'
): string {
  if (!dateStr) return fallback

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return fallback
    return format(date, formatStr)
  } catch {
    return fallback
  }
}
