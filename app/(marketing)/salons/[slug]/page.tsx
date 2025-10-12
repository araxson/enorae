import {
  MarketingSalonProfilePage,
  generateSalonProfileMetadata,
} from '@/features/marketing/salon-directory'

export { generateSalonProfileMetadata as generateMetadata }

type PageProps = Parameters<typeof MarketingSalonProfilePage>[0]

export default async function SalonDetailPage(props: PageProps) {
  return <MarketingSalonProfilePage {...props} />
}
