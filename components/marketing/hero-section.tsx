import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type MarketingHeroProps = {
  title: string
  subtitle: string
  description: string
  align?: 'center' | 'start'
  variant?: 'stacked' | 'simple'
}

const baseSectionClasses = 'bg-muted/30'
const baseContainerClasses = 'mx-auto w-full px-4 sm:px-6 lg:px-8'

export function MarketingHero({
  title,
  subtitle,
  description,
  align = 'center',
  variant = 'stacked',
}: MarketingHeroProps) {
  const headerAlignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const contentAlignment = align === 'center' ? 'mx-auto text-center' : 'text-left'

  if (variant === 'simple') {
    return (
      <section className={baseSectionClasses}>
        <div className={cn('max-w-4xl py-16', baseContainerClasses)}>
          <Card className="border-0 shadow-none">
            <CardHeader className={cn('gap-4', headerAlignment)}>
              <CardTitle>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
              </CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className={cn('max-w-3xl text-muted-foreground', contentAlignment)}>
              <p className="text-lg leading-7">{description}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(baseSectionClasses, 'py-16 md:py-24 lg:py-32')}>
      <div className={cn('max-w-6xl', baseContainerClasses)}>
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className={cn('gap-6', headerAlignment)}>
            <CardTitle>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{title}</h1>
            </CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className={cn('max-w-3xl text-muted-foreground', contentAlignment)}>
            <p className="text-lg leading-7">{description}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
