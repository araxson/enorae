import { Heart, Lightbulb, Eye, Shield } from 'lucide-react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { valuesData } from './values.data'

const iconMap = {
  heart: Heart,
  lightbulb: Lightbulb,
  eye: Eye,
  shield: Shield,
} as const

export function Values() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl bg-muted/30">
      <ItemGroup className="gap-8">
        <Item className="mx-auto flex-col items-center text-center" variant="muted">
          <ItemHeader>
            <h2 className="scroll-m-20">{valuesData.title}</h2>
          </ItemHeader>
        </Item>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {valuesData.values.map((value) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap]
            return (
              <Item key={value.title} variant="outline">
                <ItemMedia variant="icon">
                  <Icon className="size-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{value.title}</ItemTitle>
                  <ItemDescription>{value.description}</ItemDescription>
                </ItemContent>
              </Item>
            )
          })}
        </div>
      </ItemGroup>
    </section>
  )
}
