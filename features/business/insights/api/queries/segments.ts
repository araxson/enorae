import 'server-only'

import type { CustomerMetrics, CustomerSegment } from './types'
import { getCustomerInsights } from './customers'

const SEGMENT_SAMPLE_LIMIT = 1000

export async function getCustomersBySegment(
  segment: CustomerSegment,
): Promise<CustomerMetrics[]> {
  const metrics = await getCustomerInsights(SEGMENT_SAMPLE_LIMIT)
  return metrics.filter((metric) => metric.segment === segment)
}
