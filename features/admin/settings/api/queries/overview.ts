import 'server-only'

import { createOperationLogger } from '@/lib/observability/logger'
export async function getAdminSettingsOverview() {
  const logger = createOperationLogger('getAdminSettingsOverview', {})
  logger.start()

  return {
    sections: ['security', 'email', 'notifications', 'database', 'general']
  }
}