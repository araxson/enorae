'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react'
import { updateServiceStatus } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries/appointment-services'
import { useToast } from '@/lib/hooks/use-toast'

interface AppointmentServiceProgressProps {
  appointmentId: string
  services: AppointmentServiceDetails[]
  onUpdate: () => void
}

export function AppointmentServiceProgress({
  appointmentId,
  services,
  onUpdate,
}: AppointmentServiceProgressProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  const stats = {
    total: services.length,
    completed: services.filter((s) => s['status'] === 'completed').length,
    inProgress: services.filter((s) => s['status'] === 'in_progress').length,
    pending: services.filter((s) => s['status'] === 'pending').length,
    cancelled: services.filter((s) => s['status'] === 'cancelled').length,
  }

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  const handleStatusUpdate = async (serviceId: string, newStatus: string) => {
    setUpdatingId(serviceId)
    try {
      const formData = new FormData()
      formData.append('appointmentServiceId', serviceId)
      formData.append('status', newStatus)

      const result = await updateServiceStatus(formData)

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Unable to update service status',
          description: result.error,
        })
      } else {
        toast({
          title: 'Service updated',
          description: 'The service status was updated successfully.',
        })
        onUpdate()
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update service status',
        description: error instanceof Error ? error.message : 'Please try again later.',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-primary" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-secondary" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground/40" />
    }
  }

  const getNextStatus = (currentStatus: string | null) => {
    switch (currentStatus) {
      case 'pending':
        return 'in_progress'
      case 'in_progress':
        return 'completed'
      case 'completed':
        return 'pending'
      default:
        return 'in_progress'
    }
  }

  const getStatusLabel = (status: string | null) => {
    return status ? status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Pending'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Completed', value: stats.completed },
              { label: 'In Progress', value: stats.inProgress },
              { label: 'Pending', value: stats.pending },
              { label: 'Cancelled', value: stats.cancelled },
            ].map((item) => (
              <Card key={item.label}>
                <CardHeader className="items-center">
                  <CardTitle>{item.value}</CardTitle>
                  <CardDescription>{item.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => {
              const isCancelled = service['status'] === 'cancelled'
              const nextStatus = getNextStatus(service['status'])

              return (
                <Card key={service['id']}>
                  <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                      {getStatusIcon(service['status'])}
                      <div className="flex-1">
                        <p className="font-medium">{service['service_name']}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline">{getStatusLabel(service['status'])}</Badge>
                          {service['staff_name'] && (
                            <span className="text-sm text-muted-foreground">
                              {service['staff_name']}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCancelled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(service['id'] || '', nextStatus)}
                          disabled={updatingId === service['id']}
                        >
                          {updatingId === service['id']
                            ? 'Updating...'
                            : service['status'] === 'completed'
                            ? 'Reset'
                            : 'Mark ' + getStatusLabel(nextStatus)}
                        </Button>
                      )}
                      {service['status'] !== 'cancelled' && service['status'] !== 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(service['id'] || '', 'cancelled')}
                          disabled={updatingId === service['id']}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {services.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No services to track
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
