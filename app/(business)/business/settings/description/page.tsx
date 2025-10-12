import { SalonDescriptionSettings } from '@/features/business/settings-description'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Description Settings',
  description: 'Manage your salon description and details',
  noIndex: true,
})

export default async function DescriptionSettingsPage() {
  return <SalonDescriptionSettings />
}
