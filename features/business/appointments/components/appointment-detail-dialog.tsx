'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppointmentServicesManager } from './appointment-services-manager'
import { AppointmentServiceProgress } from './appointment-service-progress'
import type { AppointmentServiceDetails } from '../api/queries/appointment-services'

interface AppointmentDetailDialogProps {
  appointmentId: string
  isOpen: boolean
  onClose: () => void
}

export function AppointmentDetailDialog({
  appointmentId,
  isOpen,
  onClose,
}: AppointmentDetailDialogProps) {
  const [services, setServices] = useState<AppointmentServiceDetails[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && appointmentId) {
      loadServices()
    }
  }, [isOpen, appointmentId])

  const loadServices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/services`)
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleServicesUpdate = () => {
    loadServices()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            <AppointmentServicesManager
              appointmentId={appointmentId}
              services={services}
              onUpdate={handleServicesUpdate}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <AppointmentServiceProgress
              appointmentId={appointmentId}
              services={services}
              onUpdate={handleServicesUpdate}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
