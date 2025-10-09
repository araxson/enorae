import { StaffAnalytics } from '@/features/staff/analytics'

export const metadata = {
  title: 'My Analytics',
  description: 'Track your performance, earnings, and customer relationships',
}

export default async function StaffAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <StaffAnalytics />
    </div>
  )
}
