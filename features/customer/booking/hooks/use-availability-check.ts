import { useEffect, useRef, useState, useTransition } from 'react'
import { checkStaffAvailability } from '@/features/shared/appointments/api/queries/availability'

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export function useAvailabilityCheck(
  selectedStaff: string,
  startDate: Date | null,
  endDate: Date | null
) {
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null)
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle')
  const [isCheckingAvailability, startAvailabilityCheck] = useTransition()
  const latestCheckRef = useRef(0)

  useEffect(() => {
    if (!selectedStaff || !startDate || !endDate) {
      setAvailabilityStatus('idle')
      setAvailabilityMessage(null)
      return
    }

    setAvailabilityStatus('checking')
    setAvailabilityMessage(null)

    const checkId = latestCheckRef.current + 1
    latestCheckRef.current = checkId

    startAvailabilityCheck(async () => {
      try {
        const result = await checkStaffAvailability({
          staffId: selectedStaff,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        })

        if (checkId !== latestCheckRef.current) {
          return
        }

        if (result.available) {
          setAvailabilityStatus('available')
          setAvailabilityMessage('Staff member is available for the selected time.')
        } else {
          setAvailabilityStatus('unavailable')
          if (result['reason']) {
            const blockTypeLabel = result.blockType ? `(${result.blockType})` : ''
            setAvailabilityMessage(`Time blocked ${blockTypeLabel}: ${result['reason']}`)
          } else {
            setAvailabilityMessage('Staff member has a conflict at the selected time.')
          }
        }
      } catch (availabilityError) {
        if (checkId !== latestCheckRef.current) {
          return
        }
        setAvailabilityStatus('error')
        setAvailabilityMessage(
          availabilityError instanceof Error
            ? availabilityError.message
            : 'Unable to check availability. Please try again.'
        )
      }
    })
  }, [selectedStaff, startDate, endDate])

  return {
    availabilityStatus,
    availabilityMessage,
    isCheckingAvailability,
  }
}
