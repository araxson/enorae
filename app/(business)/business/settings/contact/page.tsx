import { SalonContactSettings } from '@/features/business/settings-contact'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Contact Settings',
  description: 'Manage your salon contact information',
  noIndex: true,
})

export default async function ContactSettingsPage() {
  return <SalonContactSettings />
}
