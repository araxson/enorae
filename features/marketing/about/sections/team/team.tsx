import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { teamData } from './team.data'

export function Team() {
  return (
    <MarketingSection spacing="compact">
      <Item className="mx-auto flex-col items-center text-center" variant="muted">
        <ItemHeader>
          <ItemTitle>{teamData.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{teamData.description}</ItemDescription>
        </ItemContent>
      </Item>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {teamData.stats.map((stat) => (
          <Item
            key={stat.label}
            className="flex-col items-center text-center"
            variant="outline"
          >
            <ItemContent>
              <ItemTitle>{stat.value}</ItemTitle>
              <ItemDescription>{stat.label}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </MarketingSection>
  )
}
