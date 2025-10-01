import { SalonDetail } from '@/features/salon-detail'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <SalonDetail slug={slug} />
}