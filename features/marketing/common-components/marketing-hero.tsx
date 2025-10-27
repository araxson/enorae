import { type ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

type MarketingHeroProps = {
  title: string
  subtitle: string
  description: string
  align?: 'center' | 'start'
  variant?: 'stacked' | 'simple'
  children?: ReactNode
}

const sectionSpacing = {
  simple: 'py-12',
  stacked: 'py-16 md:py-24 lg:py-28',
} as const

export function MarketingHero({
  title,
  subtitle,
  description,
  align = 'center',
  variant = 'stacked',
  children,
}: MarketingHeroProps) {
  const headerAlignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const contentAlignment =
    align === 'center'
      ? 'items-center text-center'
      : 'items-start text-left'

  return (
    <section className="w-full">
      <div
        className={cn(
          'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8',
          sectionSpacing[variant],
        )}
      >
        <Card>
          <CardHeader className={cn('gap-4 md:gap-6', headerAlignment)}>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className={cn('flex w-full flex-col gap-6', contentAlignment)}>
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <ItemDescription>{description}</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
            {children}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
