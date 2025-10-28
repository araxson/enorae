export function formatDate(date: string | null): string {
  if (!date) return 'Never'
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getActivityStatus(lastActivity: string | null): string {
  if (!lastActivity) return 'Inactive'

  const now = new Date()
  const activityDate = new Date(lastActivity)
  const diffMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))

  if (diffMinutes < 5) return 'Active now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
  return `${Math.floor(diffMinutes / 1440)}d ago`
}
