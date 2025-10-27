'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, Mail, User } from 'lucide-react'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import type { Database } from '@/lib/types/database.types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

type Appointment = Database['public']['Views']['appointments_view']['Row']

type ClientDetailDialogProps = {
  client: ClientWithHistory | null
  staffId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailDialog({
  client,
  staffId,
  open,
  onOpenChange,
}: ClientDetailDialogProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !client) return

    let isMounted = true
    const controller = new AbortController()

    const loadAppointments = async () => {
      setLoading(true)
      try {
        // API_INTEGRATION_FIX: Add 10 second timeout for API calls
        const API_REQUEST_TIMEOUT_MS = 10000 // 10 seconds
        const timeoutSignal = AbortSignal.timeout(API_REQUEST_TIMEOUT_MS)
        const response = await fetch(
          `/api/staff/clients/${client['customer_id']}/appointments?staffId=${staffId}`,
          {
            signal: AbortSignal.any([controller.signal, timeoutSignal]),
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to load appointments: ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          setAppointments(data || [])
        }
      } catch (error) {
        // API_INTEGRATION_FIX: Handle AbortError and timeout errors
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Appointments load request cancelled or timed out')
          return
        }
        console.error('[ClientDetail] Failed to load appointments', error)
        if (isMounted) {
          setAppointments([])
          // TODO: Add toast notification for user feedback
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadAppointments()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [open, client, staffId])

  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client['customer_name'] || client['customer_id'] || 'Client Details'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Item variant="outline" size="sm">
              <ItemMedia variant="icon">
                <User className="h-5 w-5" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{client['customer_name'] || 'Walk-in Customer'}</ItemTitle>
                {client['customer_id'] ? (
                  <ItemDescription>ID {client['customer_id']}</ItemDescription>
                ) : null}
              </ItemContent>
            </Item>

            {client['customer_email'] ? (
              <Item variant="outline" size="sm">
                <ItemMedia variant="icon">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{client['customer_email']}</ItemTitle>
                  <ItemDescription>Email</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}

            <Item variant="outline" size="sm">
              <ItemMedia variant="icon">
                <Calendar className="h-5 w-5" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{client['total_appointments']}</ItemTitle>
                <ItemDescription>Total appointments</ItemDescription>
              </ItemContent>
            </Item>

            {client['total_revenue'] !== undefined && client['total_revenue'] !== null ? (
              <Item variant="outline" size="sm">
                <ItemMedia variant="icon">
                  <DollarSign className="h-5 w-5" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>${Number(client['total_revenue']).toFixed(2)}</ItemTitle>
                  <ItemDescription>Total revenue</ItemDescription>
                </ItemContent>
              </Item>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Appointment History</h3>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Loading appointments…
              </div>
            ) : appointments.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Calendar className="h-8 w-8" aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No appointments found</EmptyTitle>
                  <EmptyDescription>This client has no appointment history yet.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup className="gap-2">
                {appointments.map((apt) => {
                  const serviceNames = 'Appointment'
                  const startTime = apt['start_time']
                    ? format(new Date(apt['start_time']), 'MMM dd, yyyy • h:mm a')
                    : null

                  return (
                    <Item key={apt['id']} variant="outline" size="sm">
                      <ItemContent>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant={apt['status'] === 'completed' ? 'default' : 'outline'}>
                            {apt['status']}
                          </Badge>
                          {startTime ? (
                            <ItemDescription>{startTime}</ItemDescription>
                          ) : null}
                        </div>
                        <ItemTitle>{serviceNames}</ItemTitle>
                        {apt['duration_minutes'] ? (
                          <ItemDescription>{apt['duration_minutes']} minutes</ItemDescription>
                        ) : null}
                      </ItemContent>
                    </Item>
                  )
                })}
              </ItemGroup>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
