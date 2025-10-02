import { Stack } from '@/components/layout'
import { Hero } from './sections/hero'
import { Mission } from './sections/mission'
import { Values } from './sections/values'
import { Team } from './sections/team'

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
