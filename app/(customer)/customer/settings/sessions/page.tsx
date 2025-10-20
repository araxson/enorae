import { SessionManagementFeature } from '@/features/customer/sessions'

export const metadata = {
  title: 'Active Sessions | Enorae',
  description: 'Manage your active sessions and devices',
}

export default function Page() {
  return <SessionManagementFeature />
}
