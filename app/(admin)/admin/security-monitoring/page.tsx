import { SecurityMonitoring } from '@/features/admin/security-monitoring'

export const metadata = {
  title: 'Security Monitoring',
  description: 'Monitor access attempts, detect anomalies, and manage security configurations',
}

export default async function SecurityMonitoringPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <SecurityMonitoring />
    </div>
  )
}
