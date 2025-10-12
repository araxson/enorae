import { Users, Scissors } from 'lucide-react'
import { Group } from '@/components/layout'
import { Small } from '@/components/ui/typography'

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
          <Small className="text-muted-foreground">
            {staffCount} {staffCount === 1 ? 'staff member' : 'staff'}
          </Small>
        </Group>
      )}
      {servicesCount && servicesCount > 0 && (
        <Group gap="xs">
          <Scissors className="h-4 w-4 text-muted-foreground" />
          <Small className="text-muted-foreground">
            {servicesCount} {servicesCount === 1 ? 'service' : 'services'}
          </Small>
        </Group>
      )}
    </Group>
  )
}
