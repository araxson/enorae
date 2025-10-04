import { SalonLocations } from '@/features/business/locations'

export const metadata = {
  title: 'Salon Locations',
  description: 'Manage salon locations and addresses',
}

export default async function SalonLocationsPage() {
  return <SalonLocations />
}
