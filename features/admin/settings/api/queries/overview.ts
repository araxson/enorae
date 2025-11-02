import 'server-only'

import { createOperationLogger } from '@/lib/observability'
export async function getAdminSettingsOverview() {
  const logger = createOperationLogger('getAdminSettingsOverview', {})
  logger.start()

  return {
    sections: ['security', 'email', 'notifications', 'database', 'general']
  }
}