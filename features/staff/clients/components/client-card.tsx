'use client'

import { Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type ClientCardProps = {
  client: ClientWithHistory
  onSelect: () => void
}

export function ClientCard({ client, onSelect }: ClientCardProps) {
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent"
      onClick={onSelect}
    >
      <CardHeader>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemContent>
              <CardTitle>{client.customer_name || 'Walk-in Customer'}</CardTitle>
              {client.customer_email ? (
                <CardDescription>{client.customer_email}</CardDescription>
              ) : null}
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          <Item size="sm" variant="muted">
            <ItemMedia variant="icon">
              <Calendar className="h-4 w-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{client.total_appointments} appointments</ItemTitle>
            </ItemContent>
          </Item>
          {client.total_revenue && client.total_revenue > 0 ? (
            <Item size="sm" variant="muted">
              <ItemMedia variant="icon">
                <DollarSign className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>${Number(client.total_revenue).toFixed(2)}</ItemTitle>
                <ItemDescription>Lifetime value</ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
          {client.last_appointment_date ? (
            <Item size="sm" variant="muted">
              <ItemContent>
                <ItemTitle>Last visit</ItemTitle>
                <ItemDescription>
                  {new Date(client.last_appointment_date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
