import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { CancelAppointmentDialog } from './cancel-appointment-dialog'
import { RescheduleRequestDialog } from './reschedule-request-dialog'

interface AppointmentActionsSectionProps {
  appointmentId: string | null
  status: string | null
  startTime: string | null
}

export function AppointmentActionsSection({
  appointmentId,
  status,
  startTime,
}: AppointmentActionsSectionProps) {
  return (
    <ButtonGroup aria-label="Actions" orientation="horizontal">
      <div className="w-full sm:flex-1">
        <Button asChild variant="outline">
          <Link href="/customer/appointments">Back to appointments</Link>
        </Button>
      </div>
      {status === 'confirmed' && startTime && appointmentId ? (
        <>
          <RescheduleRequestDialog
            appointmentId={appointmentId}
            currentStartTime={startTime}
          />
          <CancelAppointmentDialog appointmentId={appointmentId} startTime={startTime} />
        </>
      ) : null}
    </ButtonGroup>
  )
}
