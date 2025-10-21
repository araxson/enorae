import { Badge } from '@/components/ui/badge'
import { Scissors, Sparkles, Heart, Crown } from 'lucide-react'
import { cn } from "@/lib/utils";

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
    <div className={cn('flex gap-2 items-center', className)}>
      {displaySpecialties.map((specialty) => {
        const Icon = SPECIALTY_ICONS[specialty]
        return (
          <Badge key={specialty} variant="default" className="gap-1">
            {Icon && <Icon className="h-3 w-3" />}
            {specialty}
          </Badge>
        )
      })}
      {hasMore && (
        <Badge variant="outline">
          +{specialties.length - limit!} more
        </Badge>
      )}
    </div>
  )
}
