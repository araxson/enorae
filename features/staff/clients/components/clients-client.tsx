'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Users, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
import type { ClientWithHistory } from '../api/queries'
import { ClientStats } from './client-stats'
import { ClientFilters } from './client-filters'
import { ClientDetailDialog } from './client-detail-dialog'

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

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Stack gap="md" className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <P className="font-medium">No Clients Yet</P>
              <Muted>Your client list will appear here once you complete appointments</Muted>
            </div>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack gap="xl">
      <ClientStats clients={filteredAndSortedClients} />

      <ClientFilters onSearchChange={setSearchQuery} onSortChange={setSortBy} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedClients.map((client) => (
          <Card
            key={client.customer_id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setSelectedClient(client)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{client.customer_name || 'Walk-in Customer'}</CardTitle>
              {client.customer_email && <Muted className="text-sm">{client.customer_email}</Muted>}
            </CardHeader>
            <CardContent>
              <Stack gap="sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <P className="text-sm">{client.total_appointments} appointments</P>
                </div>
                {client.total_revenue && client.total_revenue > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <P className="text-sm">${Number(client.total_revenue).toFixed(2)} total</P>
                  </div>
                )}
                {client.last_appointment_date && (
                  <div className="text-sm">
                    <Muted>Last visit: {format(new Date(client.last_appointment_date), 'MMM dd, yyyy')}</Muted>
                  </div>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </div>

      <ClientDetailDialog
        client={selectedClient}
        staffId={staffId}
        open={!!selectedClient}
        onOpenChange={(open) => !open && setSelectedClient(null)}
      />
    </Stack>
  )
}
