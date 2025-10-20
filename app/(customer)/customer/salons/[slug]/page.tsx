import { SalonDetailFeature, generateSalonDetailMetadata } from '@/features/customer/salon-detail'

export { generateSalonDetailMetadata as generateMetadata }

export default function Page(props: Parameters<typeof SalonDetailFeature>[0]) {
  return <SalonDetailFeature {...props} />
}
