import { Users, Scissors } from 'lucide-react'
import { cn } from "@/lib/utils";

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
    <div className={cn('flex gap-4 items-center', className)}>
      {staffCount && staffCount > 0 && (
        <div className="flex gap-2 items-center">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            {staffCount} {staffCount === 1 ? 'staff member' : 'staff'}
          </p>
        </div>
      )}
      {servicesCount && servicesCount > 0 && (
        <div className="flex gap-2 items-center">
          <Scissors className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            {servicesCount} {servicesCount === 1 ? 'service' : 'services'}
          </p>
        </div>
      )}
    </div>
  )
}
