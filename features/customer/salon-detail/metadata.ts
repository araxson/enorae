import type { Metadata } from 'next'
import { getSalonBySlug } from './api/queries'

export interface SalonDetailParams {
  slug: string
}

export async function generateSalonDetailMetadata({
  params,
}: {
  params: Promise<SalonDetailParams> | SalonDetailParams
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const salon = await getSalonBySlug(slug)

    return {
      title: `${salon.name || 'Salon'} - Book Appointment`,
      description:
        salon.description ||
        `Book an appointment at ${salon.name || 'this salon'}. View services, staff, and reviews.`,
      openGraph: {
        title: `${salon.name || 'Salon'} - Book Appointment`,
        description:
          salon.description ||
          `Book an appointment at ${salon.name || 'this salon'}`,
        type: 'website',
      },
    }
  } catch {
    return {
      title: 'Salon Details',
      description: 'View salon details, services, staff, and reviews.',
    }
  }
}
