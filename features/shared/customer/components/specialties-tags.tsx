import { Scissors, Sparkles, Heart, Crown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SpecialtiesTagsProps {
  specialties: string[] | null
  limit?: number
  className?: string
}

const SPECIALTY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Hair Styling': Scissors,
  'Color Treatments': Sparkles,
  'Bridal Services': Heart,
  'Balayage': Sparkles,
  'Keratin Treatments': Crown,
}

export function SpecialtiesTags({ specialties, limit, className }: SpecialtiesTagsProps) {
  if (!specialties || specialties.length === 0) {
    return null
  }

  const displaySpecialties = limit ? specialties.slice(0, limit) : specialties
  const hasMore = limit && specialties.length > limit

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displaySpecialties.map((specialty) => {
        const Icon = SPECIALTY_ICONS[specialty]
        return (
          <Badge key={specialty} variant="secondary">
            <span className="flex items-center gap-2">
              {Icon ? <Icon className="size-3" aria-hidden="true" /> : null}
              <span>{specialty}</span>
            </span>
          </Badge>
        )
      })}
      {hasMore && (
        <Badge variant="secondary">
          <span>+{specialties.length - limit!} more</span>
        </Badge>
      )}
    </div>
  )
}
