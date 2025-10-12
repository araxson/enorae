export type RuleType =
  | 'time_based'
  | 'day_based'
  | 'advance_booking'
  | 'demand'
  | 'seasonal'
  | 'customer_segment'

export const dayOptions = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

export const segmentOptions = [
  { value: 'all', label: 'All Customers' },
  { value: 'loyalty_vip', label: 'Loyalty & VIP' },
  { value: 'new_customers', label: 'New Customers' },
  { value: 'high_value', label: 'High-Value Customers' },
]

export const ruleLabels: Record<RuleType, string> = {
  time_based: 'Time-Based',
  day_based: 'Day-Based',
  advance_booking: 'Advance Booking',
  demand: 'Demand-Based',
  seasonal: 'Seasonal Pricing',
  customer_segment: 'Customer Segment',
}
