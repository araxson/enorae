import { DatabaseHealth } from '@/features/admin/database-health'

export const metadata = {
  title: 'Database Health | Admin',
  description: 'Monitor database performance, optimization, and health metrics',
}

export default function DatabaseHealthPage() {
  return <DatabaseHealth />
}
