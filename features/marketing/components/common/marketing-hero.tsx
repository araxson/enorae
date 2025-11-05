import { type ReactNode } from 'react'

import { ItemDescription } from '@/components/ui/item'
import { MarketingPanel } from './marketing-panel'
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
  const spacingVariant = variant === 'simple' ? 'compact' : 'relaxed'
  const alignment = align === 'center' ? 'center' : 'start'

  return (
    <MarketingSection spacing={spacingVariant} groupClassName="gap-0">
      <MarketingPanel
        align={alignment}
        title={title}
        description={subtitle}
      >
        <ItemDescription>{description}</ItemDescription>
        {children}
      </MarketingPanel>
    </MarketingSection>
  )
}
