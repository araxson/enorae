import { SalonSearchFeature, salonSearchMetadata } from '@/features/customer/salon-search'

export const metadata = salonSearchMetadata

export default function Page(props: Parameters<typeof SalonSearchFeature>[0]) {
  return <SalonSearchFeature {...props} />
}
