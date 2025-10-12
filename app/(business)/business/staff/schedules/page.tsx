import { StaffSchedulesManagement } from '@/features/business/staff-schedules'

export const metadata = {
  title: 'Staff Schedules',
  description: 'Manage staff working schedules',
}

export default async function StaffSchedulesPage() {
  return <StaffSchedulesManagement />
}
