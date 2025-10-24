import { Hero } from '@/features/marketing/about/components/sections/hero'
import { Mission } from '@/features/marketing/about/components/sections/mission'
import { Values } from '@/features/marketing/about/components/sections/values'
import { Team } from '@/features/marketing/about/components/sections/team'

export function AboutPage() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <Mission />
      <Values />
      <Team />
    </div>
  )
}
