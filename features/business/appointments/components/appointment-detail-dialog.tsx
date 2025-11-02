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
import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'
import { TIME_MS } from '@/lib/config/constants'

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
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!isOpen || !appointmentId) {
      return
    }

    let isMounted = true
    const controller = new AbortController()

    const loadServices = async () => {
      setIsLoading(true)
      try {
        // API_INTEGRATION_FIX: Add 10 second timeout for API calls
        const timeoutSignal = AbortSignal.timeout(TIME_MS.API_REQUEST_TIMEOUT)
        const response = await fetch(`/api/appointments/${appointmentId}/services`, {
          signal: AbortSignal.any([controller.signal, timeoutSignal]),
        })

        if (!response.ok) {
          throw new Error(`Failed to load services: ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          setServices(data.services || [])
        }
      } catch (error) {
        // API_INTEGRATION_FIX: Handle AbortError and timeout errors
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Services load request cancelled or timed out')
          return
        }
        console.error('[AppointmentDetail] Failed to load services', error)
        if (isMounted) {
          setServices([])
          // TODO: Add toast notification for user feedback
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadServices()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [isOpen, appointmentId, refreshKey])

  // API_INTEGRATION_FIX: Update handler to reload services
  const handleServicesUpdate = () => {
    setRefreshKey(prev => prev + 1)
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
