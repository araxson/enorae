import { SalonDetail } from '@/features/customer/salon-detail'
import { getSalonMetadataBySlug } from '@/features/customer/salon-detail/api/queries'
import { generateMetadata as genMeta } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const salon = await getSalonMetadataBySlug(slug)

  if (!salon) {
    return genMeta({
      title: 'Salon Not Found',
      description: 'The salon you are looking for could not be found',
    })
  }

  const salonName = salon.name || 'Salon'
  const salonDesc = salon.description
  const salonLocation = salon.location_address

  return genMeta({
    title: salonName,
    description: salonDesc || `${salonName} - Professional salon services`,
    keywords: [salonName, 'salon', 'beauty', salonLocation || 'professional services'],
  })
}

export default async function SalonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <SalonDetail slug={slug} />
}
