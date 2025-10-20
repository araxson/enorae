import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="gap-4 text-balance">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  const alignmentClasses =
    align === 'center' ? 'items-center text-center text-balance' : 'items-start text-left text-balance'

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className={`mx-auto max-w-3xl gap-4 ${alignmentClasses}`}>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className={`mx-auto max-w-3xl ${align === 'center' ? 'text-center' : 'text-left'}`}>
            <CardDescription>{description}</CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
