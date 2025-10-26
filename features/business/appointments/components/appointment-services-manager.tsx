'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Edit } from 'lucide-react'
import { AddServiceDialog } from './add-service-dialog'
import { EditServiceDialog } from './edit-service-dialog'
import { ConfirmDialog } from '@/features/shared/ui-components'
import { removeServiceFromAppointment } from '@/features/business/appointments/api/mutations'
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries/appointment-services'
import { useToast } from '@/lib/hooks/use-toast'

interface AppointmentServicesManagerProps {
  appointmentId: string
  services: AppointmentServiceDetails[]
  onUpdate: () => void
  isLoading: boolean
}

export function AppointmentServicesManager({
  appointmentId,
  services,
  onUpdate,
  isLoading,
}: AppointmentServicesManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingService, setEditingService] = useState<AppointmentServiceDetails | null>(null)
  const [deletingService, setDeletingService] = useState<AppointmentServiceDetails | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatTime = (time: string | null) => {
    if (!time) return '-'
    return new Date(time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'confirmed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const handleDelete = async () => {
    if (!deletingService) return

    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append('appointmentServiceId', deletingService['id'] || '')

      try {
        await removeServiceFromAppointment(formData)

        toast({
          title: 'Service removed',
          description: 'Service was removed from the appointment.',
        })
        onUpdate()
        setDeletingService(null)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to remove service',
          description: error instanceof Error ? error.message : 'An error occurred',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to remove service',
        description: 'Please try again in a moment.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const totalPrice = 0 // Price data not available in appointment_services

  const totalDuration = services.reduce(
    (sum, service) => sum + (service['duration_minutes'] || 0),
    0
  )

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Services</CardTitle>
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No services added to this appointment
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service['id']}>
                      <TableCell>
                        <div>
                          <p className="font-medium">Service ID: {service['service_id']}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{service['staff_id'] || 'Unassigned'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatTime(service['start_time'])} - {formatTime(service['end_time'])}
                      </TableCell>
                      <TableCell className="text-right">
                        {service['duration_minutes'] ? `${service['duration_minutes']} min` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        -
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(service['status'])}>
                          {service['status'] || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingService(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingService(service)}
                            disabled={services.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-between items-center pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Total Services: {services.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Duration: {totalDuration} minutes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalPrice)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AddServiceDialog
        appointmentId={appointmentId}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => {
          setShowAddDialog(false)
          onUpdate()
        }}
      />

      {editingService && (
        <EditServiceDialog
          service={editingService}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSuccess={() => {
            setEditingService(null)
            onUpdate()
          }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingService}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDelete}
        title="Remove Service"
        description="Are you sure you want to remove this service from the appointment?"
        isLoading={isDeleting}
      />
    </>
  )
}
