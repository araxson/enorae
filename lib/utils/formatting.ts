/**
 * Text formatting utilities for discovery features
 */

export function sanitizeDiscoverySearchInput(value: string): string {
  return value.replace(/[%]/g, '').replace(/,/g, '').trim()
}

export function formatTime(time: string | null | undefined): string {
  if (!time) return ''
  const parts = time.split(':')
  const hours = parts[0]
  const minutes = parts[1]
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}
