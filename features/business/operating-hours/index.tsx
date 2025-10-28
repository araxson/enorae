import { getOperatingHoursBySalon, getOperatingHoursSalon } from './api/queries'
import { OperatingHoursContent } from './components/operating-hours-content'
import { OperatingHoursError } from './components/operating-hours-error'

export async function OperatingHoursManagement() {
  let salon
  try {
    salon = await getOperatingHoursSalon()
  } catch (error) {
    return <OperatingHoursError error={error} />
  }

  const operatingHours = await getOperatingHoursBySalon(salon.id ?? '')

  return <OperatingHoursContent salonId={salon.id} operatingHours={operatingHours} />
}
