import { SalonBusinessInfo } from '@/features/business/settings-salon'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Salon Information',
  description: 'Manage salon business details and legal information',
  noIndex: true,
})

export default async function SalonBusinessInfoPage() {
  return <SalonBusinessInfo />
}
