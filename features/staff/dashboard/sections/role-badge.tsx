import { Badge } from '@/components/ui/badge'

export function RoleBadge({ roleLevel }: { roleLevel: string | null | undefined }) {
  if (roleLevel === 'senior') return <Badge variant="default">Senior Staff</Badge>
  if (roleLevel === 'regular') return <Badge variant="secondary">Staff</Badge>
  if (roleLevel === 'junior') return <Badge variant="outline">Junior Staff</Badge>
  return null
}
