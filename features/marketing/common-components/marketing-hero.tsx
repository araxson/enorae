import { type ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
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
        <CardHeader>
          <div className={cn('flex flex-col gap-4 md:gap-6', headerAlignment)}>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn('flex w-full flex-col gap-6', contentAlignment)}>
            <ItemGroup>
              <Item variant="muted">
                <ItemContent>
                  <ItemDescription>{description}</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
            {children}
          </div>
        </CardContent>
      </Card>
    </MarketingSection>
  )
}
