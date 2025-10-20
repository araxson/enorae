import { MarketingSalonDirectoryPage, marketingSalonDirectoryMetadata } from '@/features/marketing/salon-directory'

export const metadata = marketingSalonDirectoryMetadata

export default function Page(props: Parameters<typeof MarketingSalonDirectoryPage>[0]) {
  return <MarketingSalonDirectoryPage {...props} />
}
