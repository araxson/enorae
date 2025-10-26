/**
 * Text formatting utilities for discovery features
 */

export function sanitizeDiscoverySearchInput(value: string): string {
  return value.replace(/[%]/g, '').replace(/,/g, '').trim()
}

export function formatTime(time: string | null): string {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}
