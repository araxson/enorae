import { SalonMedia } from '@/features/business/media'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Media & Branding',
  description: 'Manage salon photos, brand colors, and social media links',
  noIndex: true,
})

export default async function MediaPage() {
  return <SalonMedia />
}
