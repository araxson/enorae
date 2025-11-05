import 'server-only'

import { createOperationLogger } from '@/lib/observability'
export async function getMarketingHomeHighlights() {
  const logger = createOperationLogger('getMarketingHomeHighlights', {})
  logger.start()

  return {
    partnerSalons: '500+',
    activeUsers: '10,000+',
    bookings: '50,000+',
    averageRating: '4.8 average rating'
  }
}
