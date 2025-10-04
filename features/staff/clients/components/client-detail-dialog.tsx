'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Stack, Flex, Divider } from '@/components/layout'
import { P, Muted, H3 } from '@/components/ui/typography'
import { Calendar, DollarSign, Mail, User } from 'lucide-react'
import type { ClientWithHistory } from '../api/queries'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

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
    if (open && client) {
      setLoading(true)
      fetch(`/api/staff/clients/${client.customer_id}/appointments?staffId=${staffId}`)
        .then((res) => res.json())
        .then((data) => setAppointments(data || []))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [open, client, staffId])

  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client.customer_name || 'Client Details'}</DialogTitle>
        </DialogHeader>

        <Stack gap="lg">
          <div className="grid gap-4 md:grid-cols-2">
            <Flex gap="sm" align="start">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Muted className="text-xs">Name</Muted>
                <P className="font-medium">{client.customer_name || 'Walk-in Customer'}</P>
              </div>
            </Flex>

            {client.customer_email && (
              <Flex gap="sm" align="start">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Muted className="text-xs">Email</Muted>
                  <P>{client.customer_email}</P>
                </div>
              </Flex>
            )}

            <Flex gap="sm" align="start">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Muted className="text-xs">Total Appointments</Muted>
                <P className="font-medium">{client.total_appointments}</P>
              </div>
            </Flex>

            {client.total_revenue !== undefined && client.total_revenue !== null && (
              <Flex gap="sm" align="start">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Muted className="text-xs">Total Revenue</Muted>
                  <P className="font-medium">${Number(client.total_revenue).toFixed(2)}</P>
                </div>
              </Flex>
            )}
          </div>

          <Divider />

          <div>
            <H3 className="mb-4">Appointment History</H3>
            {loading ? (
              <P className="text-muted-foreground">Loading...</P>
            ) : appointments.length === 0 ? (
              <P className="text-muted-foreground">No appointments found</P>
            ) : (
              <Stack gap="sm">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Flex justify="between" align="start" gap="md">
                      <div className="flex-1">
                        <Flex gap="sm" align="center" className="mb-2">
                          <Badge variant={apt.status === 'completed' ? 'default' : 'outline'}>
                            {apt.status}
                          </Badge>
                          {apt.start_time && (
                            <Muted className="text-xs">
                              {format(new Date(apt.start_time), 'MMM dd, yyyy • h:mm a')}
                            </Muted>
                          )}
                        </Flex>
                        {apt.service_names && <P className="text-sm">{apt.service_names}</P>}
                        {apt.duration_minutes && (
                          <Muted className="text-xs">{apt.duration_minutes} minutes</Muted>
                        )}
                      </div>
                      {apt.total_price !== undefined && apt.total_price !== null && (
                        <P className="font-medium">${Number(apt.total_price).toFixed(2)}</P>
                      )}
                    </Flex>
                  </div>
                ))}
              </Stack>
            )}
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
