import { Hero } from '../components/sections/hero'
import { Mission } from '../components/sections/mission'
import { Values } from '../components/sections/values'
import { Team } from '../components/sections/team'

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
