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
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { Salon } from '../types'

interface LanguagesCardProps {
  salon: Salon
}

export function LanguagesCard({ salon }: LanguagesCardProps) {
  return (
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemTitle>
          <h3 className="text-lg font-semibold tracking-tight">Languages</h3>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        <Empty className="border border-border/50 bg-card/40">
          <EmptyHeader>
            <EmptyTitle>Language details unavailable</EmptyTitle>
            <EmptyDescription>
              {salon['name'] || 'This salon'} hasn&apos;t shared supported languages yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted">
              <ItemHeader>
                <ItemTitle>Language support</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  Reach out directly to confirm language preferences for your visit.
                </ItemDescription>
              </ItemContent>
            </Item>
          </EmptyContent>
        </Empty>
      </ItemContent>
    </Item>
  )
}
