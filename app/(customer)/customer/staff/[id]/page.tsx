import type { Metadata } from 'next'
import { StaffProfileFeature } from '@/features/customer/staff-profiles'

export const metadata: Metadata = {
  title: 'Staff Profile - ENORAE',
  description: 'View staff member profile, services, and availability',
}

export default function Page(props: Parameters<typeof StaffProfileFeature>[0]) {
  return <StaffProfileFeature {...props} />
}
