import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { teamData } from './team.data'

export function Team() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ItemGroup className="gap-8">
        <Item className="mx-auto flex-col items-center text-center" variant="muted">
          <ItemHeader>
            <h2 className="scroll-m-20">{teamData.title}</h2>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>{teamData.description}</ItemDescription>
          </ItemContent>
        </Item>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
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
      </ItemGroup>
    </section>
  )
}
