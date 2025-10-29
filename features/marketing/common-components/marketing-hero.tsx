import { type ReactNode } from 'react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { MarketingSection } from './marketing-section'

type MarketingHeroProps = {
  title: string
  subtitle: string
  description: string
  align?: 'center' | 'start'
  variant?: 'stacked' | 'simple'
  children?: ReactNode
}

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
  const spacingVariant = variant === 'simple' ? 'compact' : 'relaxed'

  return (
    <MarketingSection spacing={spacingVariant} groupClassName="gap-0">
      <Item variant="outline" className="flex flex-col gap-6">
        <ItemHeader className={cn('flex flex-col gap-4 md:gap-6', headerAlignment)}>
          <ItemTitle className="text-balance">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
          </ItemTitle>
          <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>
        </ItemHeader>
        <ItemContent className={cn('flex w-full flex-col gap-6', contentAlignment)}>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent>
                <ItemDescription>{description}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
          {children}
        </ItemContent>
      </Item>
    </MarketingSection>
  )
}
