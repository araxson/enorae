import { Stack } from '@/components/layout'
import { Hero } from './sections/hero'
import { Content } from './sections/content'

export function TermsPage() {
  return (
    <Stack gap="none">
      <Hero />
      <Content />
    </Stack>
  )
}
