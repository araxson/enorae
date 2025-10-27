import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { missionData } from './mission.data'

export function Mission() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ItemGroup className="gap-8">
        <Item className="mx-auto flex-col items-center text-center" variant="muted">
          <ItemHeader>
            <h2 className="scroll-m-20">{missionData.title}</h2>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>{missionData.description}</ItemDescription>
          </ItemContent>
        </Item>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {missionData.goals.map((goal) => (
            <Item key={goal.title} variant="outline">
              <ItemContent>
                <ItemTitle>{goal.title}</ItemTitle>
                <ItemDescription>{goal.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </ItemGroup>
    </section>
  )
}
