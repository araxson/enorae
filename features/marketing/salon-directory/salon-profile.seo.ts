import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { getSalonProfile } from './salon-directory-page'
import type { SalonProfilePageProps } from './salon-profile-page'

export async function generateSalonProfileMetadata({
  params,
}: SalonProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await getSalonProfile(slug)

  if (!profile) {
    return genMeta({
      title: 'Salon Not Found',
      description: 'The salon you are looking for could not be found.',
    })
  }

  const { salon } = profile

  return genMeta({
    title: salon['name'] || 'Salon Profile',
    description:
      salon['short_description'] ??
      `View ${salon['name']} profile, services, and book appointments.`,
    keywords: [
      salon['name'] ?? '',
      salon['city'] ?? '',
      salon['state_province'] ?? '',
      'salon',
      'book appointment',
    ].filter(Boolean),
  })
}
