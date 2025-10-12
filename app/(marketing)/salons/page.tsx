import { MarketingSalonDirectoryPage } from '@/features/marketing/salon-directory'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Discover Salons',
  description: 'Browse and discover the best salons in your area. Find services, read reviews, and book appointments.',
  keywords: ['salons', 'beauty salons', 'hair salon', 'nail salon', 'spa', 'salon directory'],
})

type PageProps = Parameters<typeof MarketingSalonDirectoryPage>[0]

export default async function SalonsPage({ searchParams }: PageProps) {
  return <MarketingSalonDirectoryPage searchParams={searchParams} />
}
