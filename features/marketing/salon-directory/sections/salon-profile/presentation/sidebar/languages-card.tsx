import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import type { Salon } from '../types'

interface LanguagesCardProps {
  salon: Salon
}

export function LanguagesCard({ salon }: LanguagesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Language details unavailable</EmptyTitle>
            <EmptyDescription>
              {salon['name'] || 'This salon'} hasn&apos;t shared supported languages yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <span className="text-sm text-muted-foreground">
              Reach out directly to confirm language preferences for your visit.
            </span>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
