import { SessionManagement } from '@/features/shared/sessions'

export const metadata = {
  title: 'Active Sessions | Enorae',
  description: 'Manage your active sessions and devices',
}

export default function SessionsPage() {
  return <SessionManagement />
}
