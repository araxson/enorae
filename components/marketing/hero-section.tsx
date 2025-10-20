import { Section, Center, Stack } from '@/components/layout'
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
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
              <p className="text-xl text-muted-foreground">{subtitle}</p>
            </div>
            <p className="leading-7 text-lg text-muted-foreground">{description}</p>
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
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
            <p className="text-xl text-muted-foreground">{subtitle}</p>
          </Stack>
          <p className="leading-7 text-lg text-muted-foreground">{description}</p>
        </Stack>
      </Center>
    </Section>
  )
}
