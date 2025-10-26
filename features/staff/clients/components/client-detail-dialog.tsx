'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, DollarSign, Mail, User } from 'lucide-react'
import type { ClientWithHistory } from '@/features/staff/clients/api/queries'
import type { Database } from '@/lib/types/database.types'

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
            <div className="flex gap-3 items-start">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{client['customer_name'] || 'Walk-in Customer'}</p>
                {client['customer_id'] ? (
                  <p className="text-xs text-muted-foreground">ID {client['customer_id']}</p>
                ) : null}
              </div>
            </div>

            {client['customer_email'] && (
              <div className="flex gap-3 items-start">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p>{client['customer_email']}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 items-start">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Total Appointments</p>
                <p className="font-medium">{client['total_appointments']}</p>
              </div>
            </div>

            {client['total_revenue'] !== undefined && client['total_revenue'] !== null && (
              <div className="flex gap-3 items-start">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="font-medium">${Number(client['total_revenue']).toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-semibold">Appointment History</h3>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : appointments.length === 0 ? (
              <p className="text-muted-foreground">No appointments found</p>
            ) : (
              <div className="flex flex-col gap-3">
                {appointments.map((apt) => {
                  // TODO: Add service_names array to appointments view
                  const serviceNames = 'Appointment'
                  const startTime = apt['start_time']
                    ? format(new Date(apt['start_time']), 'MMM dd, yyyy • h:mm a')
                    : null

                  return (
                    <Card key={apt['id']}>
                      <CardHeader className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant={apt['status'] === 'completed' ? 'default' : 'outline'}>
                            {apt['status']}
                          </Badge>
                          {startTime && <CardDescription>{startTime}</CardDescription>}
                        </div>
                        <CardTitle>{serviceNames}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          {apt['duration_minutes'] && (
                            <span className="text-muted-foreground">{apt['duration_minutes']} minutes</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
