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
import { Separator } from '@/components/ui/separator'
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

        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3 items-start">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground text-xs">Name</p>
                <p className="leading-7 font-medium">{client.customer_name || 'Walk-in Customer'}</p>
              </div>
            </div>

            {client.customer_email && (
              <div className="flex gap-3 items-start">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground text-xs">Email</p>
                  <p className="leading-7">{client.customer_email}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 items-start">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground text-xs">Total Appointments</p>
                <p className="leading-7 font-medium">{client.total_appointments}</p>
              </div>
            </div>

            {client.total_revenue !== undefined && client.total_revenue !== null && (
              <div className="flex gap-3 items-start">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground text-xs">Total Revenue</p>
                  <p className="leading-7 font-medium">${Number(client.total_revenue).toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Appointment History</h3>
            {loading ? (
              <p className="leading-7 text-muted-foreground">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="leading-7 text-muted-foreground">No appointments found</p>
            ) : (
              <div className="flex flex-col gap-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex gap-4 items-start justify-between">
                      <div className="flex-1">
                        <div className="flex gap-3 items-center mb-2">
                          <Badge variant={apt.status === 'completed' ? 'default' : 'outline'}>
                            {apt.status}
                          </Badge>
                          {apt.start_time && (
                            <p className="text-sm text-muted-foreground text-xs">
                              {format(new Date(apt.start_time), 'MMM dd, yyyy • h:mm a')}
                            </p>
                          )}
                        </div>
                        {apt.service_names && <p className="leading-7 text-sm">{apt.service_names}</p>}
                        {apt.duration_minutes && (
                          <p className="text-sm text-muted-foreground text-xs">{apt.duration_minutes} minutes</p>
                        )}
                      </div>
                      {apt.total_price !== undefined && apt.total_price !== null && (
                        <p className="leading-7 font-medium">${Number(apt.total_price).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
