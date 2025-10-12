import { StaffLocationPage } from '@/features/staff/location'

export const metadata = {
  title: 'Location Information | Staff Portal',
  description: 'View your salon location details',
}

export default async function LocationPage() {
  return <StaffLocationPage />
}
