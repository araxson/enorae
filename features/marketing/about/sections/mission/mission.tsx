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
      <Item className="mx-auto flex-col items-center text-center" variant="muted">
        <ItemHeader>
          <ItemTitle>{missionData.title}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>{missionData.description}</ItemDescription>
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
