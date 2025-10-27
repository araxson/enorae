'use client'

import { useMemo, useState } from 'react'
import { Users, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import { ClientStats } from './client-stats'
import { ClientFilters } from './client-filters'
import { ClientDetailDialog } from './client-detail-dialog'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffQuickAction, StaffSummary } from '@/features/staff/staff-common/components/types'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type ClientsClientProps = {
  clients: ClientWithHistory[]
  staffId: string
}

export function ClientsClient({ clients, staffId }: ClientsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('appointments')
  const [selectedClient, setSelectedClient] = useState<ClientWithHistory | null>(null)

  const filteredAndSortedClients = useMemo(() => {
    const filtered = clients.filter((client) => {
      if (!searchQuery) return true
      const search = searchQuery.toLowerCase()
      return (
        client.customer_name?.toLowerCase().includes(search) ||
        client.customer_email?.toLowerCase().includes(search)
      )
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'appointments':
          return b.total_appointments - a.total_appointments
        case 'revenue':
          return (b.total_revenue || 0) - (a.total_revenue || 0)
        case 'recent':
          if (!a.last_appointment_date) return 1
          if (!b.last_appointment_date) return -1
          return new Date(b.last_appointment_date).getTime() - new Date(a.last_appointment_date).getTime()
        case 'name':
          return (a.customer_name || '').localeCompare(b.customer_name || '')
        default:
          return 0
      }
    })

    return sorted
  }, [clients, searchQuery, sortBy])

  const totals = useMemo(() => {
    const totalRevenue = clients.reduce((acc, client) => acc + (client.total_revenue || 0), 0)
    const repeatClients = clients.filter((client) => client.total_appointments > 1).length
    return { totalRevenue, repeatClients }
  }, [clients])

  const summaries: StaffSummary[] = [
    {
      id: 'active-clients',
      label: 'Active clients',
      value: clients.length.toString(),
      helper: 'All time',
      tone: clients.length > 25 ? 'success' : 'default',
    },
    {
      id: 'repeat-clients',
      label: 'Repeat clients',
      value: totals.repeatClients.toString(),
      helper: 'Booked twice or more',
      tone: totals.repeatClients > 10 ? 'success' : 'info',
    },
    {
      id: 'revenue',
      label: 'Total revenue',
      value: `$${totals.totalRevenue.toFixed(2)}`,
      helper: 'Lifetime value',
      tone: 'default',
    },
  ]

  const quickActions: StaffQuickAction[] = [
    { id: 'appointments', label: 'Recent appointments', href: '/staff/appointments', icon: Calendar },
    { id: 'services', label: 'Service preferences', href: '/staff/services', icon: DollarSign },
    { id: 'time-off', label: 'Schedule follow-up', href: '/staff/schedule', icon: Users },
  ]

  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <CardTitle>Clients</CardTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No clients yet</EmptyTitle>
              <EmptyDescription>
                Your client list will appear once you complete appointments.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <StaffPageShell
      title="Clients"
      description="Manage client relationships, understand history, and prepare for upcoming visits."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Clients' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      searchPlaceholder="Search clients by name or email…"
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      toggles={[
        { id: 'highlight-recent', label: 'Highlight recent', helper: 'Show a badge for clients seen in the last 30 days', defaultOn: true },
      ]}
    >
      <div className="space-y-6">
        <ClientStats clients={filteredAndSortedClients} />

        <ClientFilters
          onSortChange={setSortBy}
          onSearchChange={setSearchQuery}
          searchValue={searchQuery}
          showSearch={false}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedClients.map((client) => (
              <Card
                key={client.customer_id}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => setSelectedClient(client)}
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
          ))}
        </div>
      </div>

      <ClientDetailDialog
        client={selectedClient}
        staffId={staffId}
        open={!!selectedClient}
        onOpenChange={(open) => !open && setSelectedClient(null)}
      />
    </StaffPageShell>
  )
}
