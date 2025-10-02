import { OperatingHoursManagement } from '@/features/operating-hours'

export const metadata = {
  title: 'Operating Hours',
  description: 'Manage salon operating hours',
}

export default async function OperatingHoursPage() {
  return <OperatingHoursManagement />
}
