import { Section, Center, Stack } from '@/components/layout'
import { H1, Lead, P } from '@/components/ui/typography'

type MarketingHeroProps = {
  title: string
  subtitle: string
  description: string
  align?: 'center' | 'start'
  variant?: 'stacked' | 'simple'
}

export function MarketingHero({
  title,
  subtitle,
  description,
  align = 'center',
  variant = 'stacked',
}: MarketingHeroProps) {
  const textAlignClass = align === 'center' ? 'text-center' : 'text-left'

  if (variant === 'simple') {
    return (
      <section className="bg-muted/30">
        <div className={`mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 ${textAlignClass}`}>
          <div className="space-y-6">
            <div className="space-y-4">
              <H1>{title}</H1>
              <Lead>{subtitle}</Lead>
            </div>
            <P className="text-lg text-muted-foreground">{description}</P>
          </div>
        </div>
      </section>
    )
  }

  return (
    <Section size="lg" className="bg-muted/30">
      <Center className="w-full">
        <Stack gap="lg" className={`max-w-3xl ${textAlignClass}`}>
          <Stack gap="md">
            <H1>{title}</H1>
            <Lead>{subtitle}</Lead>
          </Stack>
          <P className="text-lg text-muted-foreground">{description}</P>
        </Stack>
      </Center>
    </Section>
  )
}
