import { Stack } from '@/components/layout'
import { Hero } from '../components/sections/hero'
import { Questions } from '../components/sections/questions'

export function FAQPage() {
  return (
    <Stack gap="none">
      <Hero />
      <Questions />
    </Stack>
  )
}
