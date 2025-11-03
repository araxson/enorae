import 'server-only'

import type { CustomerMetrics, CustomerSegment } from '../../api/types'
import { getCustomerInsights } from './customers'
import { createOperationLogger } from '@/lib/observability'

const SEGMENT_SAMPLE_LIMIT = 1000

export async function getCustomersBySegment(
  segment: CustomerSegment,
): Promise<CustomerMetrics[]> {
  const logger = createOperationLogger('getCustomersBySegment', {})
  logger.start()

  const metrics = await getCustomerInsights(SEGMENT_SAMPLE_LIMIT)
  return metrics.filter((metric) => metric.segment === segment)
}
