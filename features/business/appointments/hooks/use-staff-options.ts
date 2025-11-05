import { useEffect, useState } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { ServiceOptionsResponseSchema } from '@/features/business/appointments/api/queries'
import type { StaffOption } from '../api/types'
import { TIME_MS } from '@/lib/config/constants'
import { logError, logDebug } from '@/lib/observability'

export function useStaffOptions(isOpen: boolean, appointmentId: string | null) {
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [staff, setStaff] = useState<StaffOption[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!isOpen || !appointmentId) {
      return
    }

    let isMounted = true
    const controller = new AbortController()

    const loadStaff = async () => {
      setIsLoadingStaff(true)
      try {
        const timeoutSignal = AbortSignal.timeout(TIME_MS.API_REQUEST_TIMEOUT)
        const response = await fetch(
          `/api/business/appointments/${appointmentId}/service-options`,
          {
            signal: AbortSignal.any([controller.signal, timeoutSignal]),
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to load staff options (${response['status']})`)
        }

        const rawData = await response.json()
        const validationResult = ServiceOptionsResponseSchema.safeParse(rawData)

        if (!validationResult.success) {
          logError('Invalid API response in EditService', {
            operationName: 'loadStaffOptions',
            appointmentId,
            error: validationResult.error,
            errorCategory: 'validation',
          })
          throw new Error('Invalid API response format')
        }

        if (!isMounted) return

        const data = validationResult.data
        setStaff(data.staff ?? [])
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          logDebug('Staff load request cancelled or timed out', {
            operationName: 'loadStaffOptions',
            appointmentId,
          })
          return
        }

        logError('Failed to load staff options', {
          operationName: 'loadStaffOptions',
          appointmentId,
          error: error instanceof Error ? error : String(error),
          errorCategory: 'network',
        })

        if (isMounted) {
          toast({
            variant: 'destructive',
            title: 'Unable to load staff',
            description: error instanceof Error ? error.message : 'Please try again shortly.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingStaff(false)
        }
      }
    }

    void loadStaff()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [isOpen, appointmentId, toast])

  return { isLoadingStaff, staff }
}
