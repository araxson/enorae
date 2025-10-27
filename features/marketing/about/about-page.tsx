import { ItemGroup } from '@/components/ui/item'
import { Hero } from '@/features/marketing/about/sections/hero'
import { Mission } from '@/features/marketing/about/sections/mission'
import { Values } from '@/features/marketing/about/sections/values'
import { Team } from '@/features/marketing/about/sections/team'

export function AboutPage() {
  return (
    <ItemGroup>
      <Hero />
      <Mission />
      <Values />
      <Team />
    </ItemGroup>
  )
}
