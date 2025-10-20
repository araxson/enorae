import 'server-only'

import { getSalonMetadataBySlug } from '@/features/customer/salon-detail/api/queries'
import { generateMetadata as genMeta } from '@/lib/metadata'

export type SalonDetailParams = { slug: string }

export async function generateSalonDetailMetadata({
  params,
}: {
  params: Promise<SalonDetailParams> | SalonDetailParams
}) {
  const { slug } = await params
  const salon = await getSalonMetadataBySlug(slug).catch(() => null)
  if (!salon) {
    return genMeta({
      title: 'Salon Not Found',
      description: 'The salon you are looking for could not be found',
    })
  }

  const name = salon.name || 'Salon'
  return genMeta({
    title: name,
    description: salon.description || `${name} - Professional salon services`,
    keywords: [name, 'salon', 'beauty', salon.location_address || 'professional services'],
  })
}
