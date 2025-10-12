import { SalonChainDetailPage } from '@/features/customer/chains'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ChainDetailPage({ params }: PageProps) {
  const { slug } = await params

  return <SalonChainDetailPage slug={slug} />
}
