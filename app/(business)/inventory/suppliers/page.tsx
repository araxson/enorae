import { Suppliers } from '@/features/suppliers'

export const metadata = {
  title: 'Suppliers',
  description: 'Manage inventory suppliers and vendor relationships',
}

export default async function SuppliersPage() {
  return <Suppliers />
}
