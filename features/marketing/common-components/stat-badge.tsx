import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatBadgeProps {
  icon: LucideIcon
  value: string
  label: string
  color?: 'primary' | 'secondary' | 'success' | 'warning'
}

export function StatBadge({ icon: Icon, value, label }: StatBadgeProps) {
  return (
    <Card>
      <CardHeader className="items-center gap-3 justify-center">
        <Icon className="h-6 w-6 text-primary" />
        <CardTitle>{value}</CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  )
}
