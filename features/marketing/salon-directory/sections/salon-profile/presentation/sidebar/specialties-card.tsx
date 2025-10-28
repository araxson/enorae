import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle>Specialties</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Specialties coming soon</EmptyTitle>
            <EmptyDescription>
              We&apos;re compiling the signature services for {salon['name'] || 'this salon'}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted" className="flex-col gap-1">
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
      </CardContent>
    </Card>
  )
}
