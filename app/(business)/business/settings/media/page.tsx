import { SalonMedia } from '@/features/business/media'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Media & Branding',
  description: 'Manage your salon photos, brand colors, and social media links',
}

export default async function MediaPage() {
  return <SalonMedia />
}
