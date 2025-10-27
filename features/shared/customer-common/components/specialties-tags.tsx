import { Scissors, Sparkles, Heart, Crown } from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
} from '@/components/ui/item'
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
    <ItemGroup className={cn('flex flex-wrap gap-2', className)}>
      {displaySpecialties.map((specialty) => {
        const Icon = SPECIALTY_ICONS[specialty]
        return (
          <Item key={specialty} variant="muted">
            {Icon && (
              <ItemMedia variant="icon">
                <Icon className="h-3 w-3" />
              </ItemMedia>
            )}
            <ItemContent>
              <ItemDescription>{specialty}</ItemDescription>
            </ItemContent>
          </Item>
        )
      })}
      {hasMore && (
        <Item variant="muted">
          <ItemContent>
            <ItemDescription>+{specialties.length - limit!} more</ItemDescription>
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
  )
}
