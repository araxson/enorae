'use client'

import { useMemo, useState } from 'react'
import { Users, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import { ClientStats } from './client-stats'
import { ClientFilters } from './client-filters'
import { ClientDetailDialog } from './client-detail-dialog'
import { StaffPageShell } from '@/features/staff/staff-common/components/staff-page-shell'
import type { StaffQuickAction, StaffSummary } from '@/features/staff/staff-common/components/types'

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
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 text-center py-8">
            <Avatar className="h-16 w-16 mx-auto">
              <AvatarFallback className="bg-muted">
                <Users className="w-8 h-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">No Clients Yet</p>
              <p className="text-sm text-muted-foreground">Your client list will appear here once you complete appointments</p>
            </div>
          </div>
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
                <CardTitle>{client.customer_name || 'Walk-in Customer'}</CardTitle>
                {client.customer_email && <p className="text-sm text-muted-foreground">{client.customer_email}</p>}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{client.total_appointments} appointments</p>
                  </div>
                  {client.total_revenue && client.total_revenue > 0 ? (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <p>${Number(client.total_revenue).toFixed(2)} lifetime value</p>
                    </div>
                  ) : null}
                  {client.last_appointment_date ? (
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        Last visit: {new Date(client.last_appointment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  ) : null}
                </div>
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
