import { ChainDetail } from '@/features/business/chains'

type PageProps = {
  params: Promise<{ chainId: string }>
}

export default async function ChainDetailPage({ params }: PageProps) {
  const { chainId } = await params
  return <ChainDetail chainId={chainId} />
}
