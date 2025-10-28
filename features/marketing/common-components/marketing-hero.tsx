import { type ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemGroup,
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
      <Card>
        <CardHeader className={cn('gap-4 md:gap-6', headerAlignment)}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className={cn('flex w-full flex-col gap-6', contentAlignment)}>
          <ItemGroup>
            <Item variant="muted">
              <ItemHeader className="flex flex-col gap-1">
                <ItemDescription>{description}</ItemDescription>
              </ItemHeader>
            </Item>
          </ItemGroup>
          {children}
        </CardContent>
      </Card>
    </MarketingSection>
  )
}
