import { Heart, Lightbulb, Eye, Shield } from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { valuesData } from './values.data'

const iconMap = {
  heart: Heart,
  lightbulb: Lightbulb,
  eye: Eye,
  shield: Shield,
} as const

export function Values() {
  return (
    <MarketingSection spacing="compact" className="bg-muted/30">
      <Item variant="muted">
        <ItemHeader>
          <div className="w-full text-center">
            <ItemTitle>{valuesData.title}</ItemTitle>
          </div>
        </ItemHeader>
      </Item>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {valuesData.values.map((value) => {
          const Icon = iconMap[value.icon as keyof typeof iconMap]
          return (
            <Item key={value.title} variant="outline">
              <ItemMedia variant="icon">
                <Icon className="size-5" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{value.title}</ItemTitle>
                <ItemDescription>{value.description}</ItemDescription>
              </ItemContent>
            </Item>
          )
        })}
      </div>
    </MarketingSection>
  )
}
