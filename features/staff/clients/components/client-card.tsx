'use client'

import { Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import {
  Item,
  ItemActions,
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
    <Card>
      <CardHeader>
        <CardTitle>{client.customer_name || 'Walk-in Customer'}</CardTitle>
        {client.customer_email ? (
          <CardDescription>{client.customer_email}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <Item size="sm" variant="muted">
            <ItemMedia variant="icon">
              <Calendar className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{client.total_appointments} appointments</ItemTitle>
            </ItemContent>
          </Item>
          {client.total_revenue && client.total_revenue > 0 ? (
            <Item size="sm" variant="muted">
              <ItemMedia variant="icon">
                <DollarSign className="size-4" aria-hidden="true" />
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
        <Item variant="muted" size="sm">
          <ItemContent>
            <ItemTitle>Client details</ItemTitle>
            <ItemDescription>Open the full history and contact profile.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button type="button" onClick={onSelect} size="sm">
              View client details
            </Button>
          </ItemActions>
        </Item>
      </CardContent>
    </Card>
  )
}
