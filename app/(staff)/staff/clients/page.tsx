import { StaffClients } from '@/features/staff/clients'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Clients',
  description: 'View and manage your client relationships',
  noIndex: true,
})

export default async function StaffClientsPage() {
  return <StaffClients />
}
