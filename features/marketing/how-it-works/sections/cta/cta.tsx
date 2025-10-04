import Link from 'next/link'
import { Section, Stack, Center, Group } from '@/components/layout'
import { H2, P } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { ctaData } from './cta.data'

export function CTA() {
  return (
    <Section size="lg">
      <Center>
        <Stack gap="lg" className="max-w-2xl text-center">
          <Stack gap="md">
            <H2>{ctaData.title}</H2>
            <P className="text-lg">{ctaData.description}</P>
          </Stack>
          <Group gap="md" className="justify-center">
            {ctaData.buttons.map((button) => (
              <Button key={button.text} asChild variant={button.variant} size="lg">
                <Link href={button.href}>{button.text}</Link>
              </Button>
            ))}
          </Group>
        </Stack>
      </Center>
    </Section>
  )
}
