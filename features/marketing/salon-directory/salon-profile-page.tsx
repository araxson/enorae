import { notFound } from 'next/navigation'

import { SalonProfileView } from './sections'
import { getSalonProfile } from './salon-directory-page'

interface SalonProfilePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function SalonProfilePage({ params }: SalonProfilePageProps) {
  const { slug } = await params
  const profile = await getSalonProfile(slug)

  if (!profile) {
    notFound()
  }

  const { salon, services } = profile
  return <SalonProfileView salon={salon} services={services} />
}

export type { SalonProfilePageProps }

export default SalonProfilePage
