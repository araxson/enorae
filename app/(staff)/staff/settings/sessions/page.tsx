import { StaffSessionsPage } from '@/features/staff/sessions'

export const metadata = {
  title: 'Active Sessions | Staff Portal',
  description: 'Manage your active sessions and devices',
}

export default async function SessionsPage() {
  return <StaffSessionsPage />
}
