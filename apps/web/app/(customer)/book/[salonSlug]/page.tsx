import { BookingFlow } from '@/features/booking'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ salonSlug: string }>
  searchParams: Promise<{ service?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return <BookingFlow salonSlug={resolvedParams.salonSlug} serviceId={resolvedSearchParams.service} />
}