import { Users, Scissors } from 'lucide-react'
import { Group } from '@/components/layout'

interface SalonStatsProps {
  staffCount?: number | null
  servicesCount?: number | null
  className?: string
}

export function SalonStats({ staffCount, servicesCount, className }: SalonStatsProps) {
  const hasStats = (staffCount && staffCount > 0) || (servicesCount && servicesCount > 0)

  if (!hasStats) {
    return null
  }

  return (
    <Group gap="md" className={className}>
      {staffCount && staffCount > 0 && (
        <Group gap="xs">
          <Users className="h-4 w-4 text-muted-foreground" />
          <small className="text-sm font-medium leading-none text-muted-foreground">
            {staffCount} {staffCount === 1 ? 'staff member' : 'staff'}
          </small>
        </Group>
      )}
      {servicesCount && servicesCount > 0 && (
        <Group gap="xs">
          <Scissors className="h-4 w-4 text-muted-foreground" />
          <small className="text-sm font-medium leading-none text-muted-foreground">
            {servicesCount} {servicesCount === 1 ? 'service' : 'services'}
          </small>
        </Group>
      )}
    </Group>
  )
}
