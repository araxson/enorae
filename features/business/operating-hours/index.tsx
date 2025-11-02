import { getOperatingHoursBySalon, getOperatingHoursSalon } from './api/queries'
import { OperatingHoursContent, OperatingHoursError } from './components'

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
export * from './types'
