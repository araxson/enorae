import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/lib/hooks/use-toast'
import { logError } from '@/lib/observability'

type ServiceOption = {
  id: string
  name: string
}

type StaffOption = {
  id: string
  name: string
}

type ServiceFormOptions = {
  services: ServiceOption[]
  staff: StaffOption[]
}

export function useServiceFormOptions(appointmentId: string, isOpen: boolean) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<ServiceFormOptions>({
    services: [],
    staff: [],
  })
  const { toast } = useToast()
  const toastRef = useRef(toast)

  // Keep toast ref up to date
  useEffect(() => {
    toastRef.current = toast
  }, [toast])

  useEffect(() => {
    if (!isOpen || !appointmentId) {
      return
    }

    let isMounted = true
    // ASYNC FIX: Add AbortController for cancellable fetch
    const controller = new AbortController()

    const loadOptions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/business/appointments/${appointmentId}/service-options`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error(`Failed to load options (${response.status})`)
        }

        const data: Partial<ServiceFormOptions> = await response.json()

        if (!isMounted) return

        setOptions({
          services: data.services ?? [],
          staff: data.staff ?? [],
        })
      } catch (error) {
        // ASYNC FIX: Ignore AbortError when request is cancelled
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        logError('Failed to load service options', {
          error: error instanceof Error ? error : String(error),
          operationName: 'loadServiceOptions',
          appointmentId,
        })
        if (isMounted) {
          toastRef.current({
            variant: 'destructive',
            title: 'Unable to load options',
            description:
              error instanceof Error ? error.message : 'Please try again in a moment.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadOptions()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [appointmentId, isOpen])

  return { options, isLoading }
}
