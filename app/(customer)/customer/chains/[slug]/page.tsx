import { SalonChainDetailFeature } from '@/features/customer/chains'

export default function Page(props: Parameters<typeof SalonChainDetailFeature>[0]) {
  return <SalonChainDetailFeature {...props} />
}
