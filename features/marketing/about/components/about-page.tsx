import { Stack } from '@/components/layout'
import { Hero } from '../components/sections/hero'
import { Mission } from '../components/sections/mission'
import { Values } from '../components/sections/values'
import { Team } from '../components/sections/team'

export function AboutPage() {
  return (
    <Stack gap="none">
      <Hero />
      <Mission />
      <Values />
      <Team />
    </Stack>
  )
}
