'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { updateServiceStatus } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries/appointment-services'
import { useToast } from '@/lib/hooks/use-toast'
import { ServiceCompletionCard } from './service-completion-card'
import { ServiceStatusRow } from './service-status-row'

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

      try {
        await updateServiceStatus(formData)

        toast({
          title: 'Service updated',
          description: 'The service status was updated successfully.',
        })
        onUpdate()
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to update service status',
          description: error instanceof Error ? error.message : 'An error occurred',
        })
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

  return (
    <div className="space-y-6">
      <ServiceCompletionCard stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <ServiceStatusRow
                key={service['id']}
                serviceId={service['service_id'] || ''}
                status={service['status']}
                updatingId={updatingId}
                onStatusUpdate={(_, newStatus) => handleStatusUpdate(service['id'] || '', newStatus)}
              />
            ))}

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
