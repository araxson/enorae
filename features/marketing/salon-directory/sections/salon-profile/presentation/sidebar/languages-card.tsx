import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingPanel } from '@/features/marketing/components/common'
import type { Salon } from '../types'

interface LanguagesCardProps {
  salon: Salon
}

export function LanguagesCard({ salon }: LanguagesCardProps) {
  return (
    <MarketingPanel
      variant="outline"
      title="Languages"
      description={`${salon['name'] || 'This salon'} hasn't shared supported languages yet.`}
      align="start"
    >
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Language details unavailable</EmptyTitle>
          <EmptyDescription>
            We&apos;ll update this section once the team provides their supported languages.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Language support</ItemTitle>
              <ItemDescription>
                Reach out directly to confirm language preferences for your visit.
              </ItemDescription>
            </ItemContent>
          </Item>
        </EmptyContent>
      </Empty>
    </MarketingPanel>
  )
}
