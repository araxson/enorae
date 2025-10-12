import { SecurityMonitoring } from '@/features/admin/security-monitoring'

export const metadata = {
  title: 'Security Monitoring',
  description: 'Monitor access attempts, detect anomalies, and manage security configurations',
}

export default async function SecurityMonitoringPage() {
  return <SecurityMonitoring />
}
