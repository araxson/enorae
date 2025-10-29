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

interface SpecialtiesCardProps {
  salon: Salon
}

export function SpecialtiesCard({ salon }: SpecialtiesCardProps) {
  return (
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemTitle>
          <h3 className="text-lg font-semibold tracking-tight">Specialties</h3>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        <Empty className="border border-border/50 bg-card/40">
          <EmptyHeader>
            <EmptyTitle>Specialties coming soon</EmptyTitle>
            <EmptyDescription>
              We&apos;re compiling the signature services for {salon['name'] || 'this salon'}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted">
              <ItemHeader>
                <ItemTitle>Signature services</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  Check back as salons update their highlighted expertise.
                </ItemDescription>
              </ItemContent>
            </Item>
          </EmptyContent>
        </Empty>
      </ItemContent>
    </Item>
  )
}
