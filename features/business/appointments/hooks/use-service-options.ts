import { useEffect, useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { ServiceOptionsResponseSchema } from '@/features/business/appointments/api/queries'
import type { ServiceOption, StaffOption } from '../api/types'
import { TIME_MS } from '@/lib/config/constants'
import { logError, logDebug } from '@/lib/observability'

export function useServiceOptions(isOpen: boolean, appointmentId: string) {
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [services, setServices] = useState<ServiceOption[]>([])
  const [staff, setStaff] = useState<StaffOption[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!isOpen || !appointmentId) {
      return
    }

    let isMounted = true
    const controller = new AbortController()

    const loadOptions = async () => {
      setIsLoadingOptions(true)
      try {
        const timeoutSignal = AbortSignal.timeout(TIME_MS.API_REQUEST_TIMEOUT)
        const response = await fetch(
          `/api/business/appointments/${appointmentId}/service-options`,
          {
            signal: AbortSignal.any([controller.signal, timeoutSignal]),
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to load options (${response.status})`)
        }

        const rawData = await response.json()
        const validationResult = ServiceOptionsResponseSchema.safeParse(rawData)

        if (!validationResult.success) {
          logError('Invalid API response in AddService', {
            operationName: 'loadServiceOptions',
            appointmentId,
            error: validationResult.error,
            errorCategory: 'validation',
          })
          throw new Error('Invalid API response format')
        }

        if (!isMounted) return

        const data = validationResult.data
        setServices(data.services ?? [])
        setStaff(data.staff ?? [])
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          logDebug('Service options load request cancelled or timed out', {
            operationName: 'loadServiceOptions',
            appointmentId,
          })
          return
        }

        logError('Failed to load appointment service options', {
          operationName: 'loadServiceOptions',
          appointmentId,
          error: error instanceof Error ? error : String(error),
          errorCategory: 'network',
        })

        if (isMounted) {
          toast({
            variant: 'destructive',
            title: 'Unable to load service options',
            description: error instanceof Error ? error.message : 'Please try again in a moment.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false)
        }
      }
    }

    void loadOptions()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [appointmentId, isOpen, toast])

  return { isLoadingOptions, services, staff }
}
