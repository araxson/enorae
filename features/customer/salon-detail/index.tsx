import {
  getSalonBySlug,
  getSalonServices,
  getSalonStaff,
  getSalonReviews,
  getSalonMedia,
  checkIsFavorited,
} from './api/queries'
import { SalonHeader, ServiceList, StaffGrid, SalonReviews } from './components'
import type { SalonDetailParams } from './metadata'

interface SalonDetailProps {
  slug: string
}

export async function SalonDetail({ slug }: SalonDetailProps) {
  const salon = await getSalonBySlug(slug)
  const [services, staff, reviews, media, isFavorited] = await Promise.all([
    getSalonServices(salon.id || ''),
    getSalonStaff(salon.id || ''),
    getSalonReviews(salon.id || '', 20),
    getSalonMedia(salon.id || ''),
    checkIsFavorited(salon.id || ''),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SalonHeader salon={salon} media={media} isFavorited={isFavorited} />
      <ServiceList services={services} />
      <StaffGrid staff={staff} />
      <SalonReviews reviews={reviews} salonId={salon.id || ''} />
    </div>
  )
}

export async function SalonDetailFeature({
  params,
}: {
  params: Promise<SalonDetailParams> | SalonDetailParams
}) {
  const { slug } = await params

  return <SalonDetail slug={slug} />
}

export { generateSalonDetailMetadata } from './metadata'
export type * from './api/types'
