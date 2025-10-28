'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar, DollarSign, Mail, User } from 'lucide-react'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import type { Database } from '@/lib/types/database.types'
import { ClientAppointmentHistory } from './client-appointment-history'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <DialogTitle>{client['customer_name'] || client['customer_id'] || 'Client Details'}</DialogTitle>
                <ItemDescription>Overview of appointment history and contact info.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
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
            <ItemGroup className="mb-4">
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Appointment History</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
            <ClientAppointmentHistory appointments={appointments} loading={loading} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
