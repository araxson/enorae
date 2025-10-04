import { Stack } from '@/components/layout'
import { Hero } from './sections/hero'
import { Questions } from './sections/questions'

export function FAQPage() {
  return (
    <Stack gap="none">
      <Hero />
      <Questions />
    </Stack>
  )
}
