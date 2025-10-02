import { Section, Stack, Center } from '@/components/layout'
import { H1, Lead, P } from '@/components/ui/typography'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <Section size="lg" className="bg-muted/30">
      <Center>
        <Stack gap="lg" className="max-w-3xl text-center">
          <Stack gap="md">
            <H1>{heroData.title}</H1>
            <Lead>{heroData.subtitle}</Lead>
          </Stack>
          <P className="text-lg">{heroData.description}</P>
        </Stack>
      </Center>
    </Section>
  )
}
