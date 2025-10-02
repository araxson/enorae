import { Stack, Section, Grid } from '@/components/layout'
import { Hero } from './sections/hero'
import { Form } from './sections/form'
import { Info } from './sections/info'

export function ContactPage() {
  return (
    <Stack gap="none">
      <Hero />
      <Section size="lg">
        <Grid cols={{ base: 1, lg: 2 }} gap="xl">
          <Form />
          <Info />
        </Grid>
      </Section>
    </Stack>
  )
}
