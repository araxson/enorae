'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react'
import { updateServiceStatus } from '../api/mutations'
import type { AppointmentServiceDetails } from '../api/queries/appointment-services'
import { useToast } from '@/hooks/use-toast'

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
    completed: services.filter((s) => s.status === 'completed').length,
    inProgress: services.filter((s) => s.status === 'in_progress').length,
    pending: services.filter((s) => s.status === 'pending').length,
    cancelled: services.filter((s) => s.status === 'cancelled').length,
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
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <p className="text-2xl font-bold">{stats.cancelled}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
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
              const isCancelled = service.status === 'cancelled'
              const nextStatus = getNextStatus(service.status)

              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(service.status)}
                    <div className="flex-1">
                      <p className="font-medium">{service.service_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getStatusLabel(service.status)}
                        </Badge>
                        {service.staff_name && (
                          <span className="text-sm text-muted-foreground">
                            {service.staff_name}
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
                        onClick={() => handleStatusUpdate(service.id || '', nextStatus)}
                        disabled={updatingId === service.id}
                      >
                        {updatingId === service.id
                          ? 'Updating...'
                          : service.status === 'completed'
                          ? 'Reset'
                          : 'Mark ' + getStatusLabel(nextStatus)}
                      </Button>
                    )}
                    {service.status !== 'cancelled' && service.status !== 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(service.id || '', 'cancelled')}
                        disabled={updatingId === service.id}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
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
