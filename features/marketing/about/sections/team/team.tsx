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
      <Item variant="muted">
        <ItemHeader>
          <div className="w-full text-center">
            <ItemTitle>{teamData.title}</ItemTitle>
          </div>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col items-center text-center">
            <ItemDescription>{teamData.description}</ItemDescription>
          </div>
        </ItemContent>
      </Item>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {teamData.stats.map((stat) => (
          <Item key={stat.label} variant="outline">
            <ItemContent>
              <div className="flex flex-col items-center text-center">
                <ItemTitle>{stat.value}</ItemTitle>
                <ItemDescription>{stat.label}</ItemDescription>
              </div>
            </ItemContent>
          </Item>
        ))}
      </div>
    </MarketingSection>
  )
}
