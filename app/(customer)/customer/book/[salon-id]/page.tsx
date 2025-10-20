import { BookingFeature, generateBookingMetadata } from '@/features/customer/booking'

export { generateBookingMetadata as generateMetadata }

export default function Page(props: Parameters<typeof BookingFeature>[0]) {
  return <BookingFeature {...props} />
}
