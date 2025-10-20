import { StaffProfileFeature } from '@/features/customer/staff-profiles'

export default function Page(props: Parameters<typeof StaffProfileFeature>[0]) {
  return <StaffProfileFeature {...props} />
}
