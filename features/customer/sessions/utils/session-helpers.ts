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
