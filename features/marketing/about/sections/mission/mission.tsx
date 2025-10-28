import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingSection } from '@/features/marketing/common-components'
import { missionData } from './mission.data'

export function Mission() {
  return (
    <MarketingSection spacing="compact">
      <Item variant="muted">
        <ItemHeader>
          <div className="w-full text-center">
            <ItemTitle>{missionData.title}</ItemTitle>
          </div>
        </ItemHeader>
        <ItemContent>
          <div className="flex flex-col items-center text-center">
            <ItemDescription>{missionData.description}</ItemDescription>
          </div>
        </ItemContent>
      </Item>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {missionData.goals.map((goal) => (
          <Item key={goal.title} variant="outline">
            <ItemContent>
              <ItemTitle>{goal.title}</ItemTitle>
              <ItemDescription>{goal.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </MarketingSection>
  )
}
