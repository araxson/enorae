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
          <div className={cn('space-y-4', headerAlignment)}>
            <h1 className="scroll-m-20">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(baseSectionClasses, 'py-16 md:py-24 lg:py-32')}>
      <div className={cn('max-w-6xl', baseContainerClasses)}>
        <div className={cn('space-y-6', headerAlignment)}>
          <h1 className="scroll-m-20">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  )
}
