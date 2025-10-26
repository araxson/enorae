type RawPricingRule = {
  id: string
  rule_type: string
  multiplier: number | null
  fixed_adjustment: number | null
  start_time: string | null
  end_time: string | null
  days_of_week: number[] | null
  is_active: boolean
}

type ServiceInfo = {
  id: string
  name: string
  price?: number | null
}

export type DashboardRule = {
  day_of_week: string
  hour_start: number
  hour_end: number
  adjustment_type: 'surge' | 'discount'
  adjustment_percentage: number
}

export type DashboardScenario = {
  service_id: string
  service_name: string
  day: string
  hour: number
  base_price: number
  adjusted_price: number
  adjustment_type: string
  adjustment_percentage: number
}

export type DashboardInsight = {
  service_id: string
  service_name: string
  base_price: number
  avg_off_peak_price: number
  avg_peak_price: number
  potential_revenue_increase: number
}

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const parseTime = (value: string | null, fallback: number) => {
  if (!value) return fallback
  const [hour] = value.split(':').map(Number)
  return Number.isFinite(hour) ? hour : fallback
}

const toPercentage = (rule: RawPricingRule) => {
  if (rule.multiplier && rule.multiplier !== 1) {
    return (rule.multiplier - 1) * 100
  }
  if (rule.fixed_adjustment) {
    return rule.fixed_adjustment
  }
  return 0
}

export function buildPricingAnalytics(
  rules: RawPricingRule[],
  services: ServiceInfo[]
): {
  rules: DashboardRule[]
  scenarios: DashboardScenario[]
  insights: DashboardInsight[]
} {
  const activeRules = rules.filter((rule) => rule.is_active)

  const dashboardRules: DashboardRule[] = activeRules.flatMap((rule) => {
    const percentage = toPercentage(rule)
    const type = percentage >= 0 ? 'surge' : 'discount'
    const hours = {
      start: parseTime(rule.start_time, 8),
      end: parseTime(rule.end_time, 18),
    }

    const days = rule.days_of_week?.length ? rule.days_of_week : [0, 1, 2, 3, 4, 5, 6]

    return days.map((dayIndex) => ({
      day_of_week: dayNames[dayIndex] ?? 'sunday',
      hour_start: hours.start,
      hour_end: hours.end,
      adjustment_type: type,
      adjustment_percentage: Math.abs(percentage),
    }))
  })

  const scenarios: DashboardScenario[] = []
  const insightsMap = new Map<string, { base: number; peak: number[]; off: number[]; count: number }>()

  const estimatedBookings = 25

  for (const service of services) {
    const basePrice = Number(service.price || 0)
    insightsMap.set(service.id, { base: basePrice, peak: [], off: [], count: 0 })

    for (const rule of dashboardRules) {
      const adjustmentPercent = rule.adjustment_percentage
      const adjustedPrice =
        rule.adjustment_type === 'surge'
          ? basePrice * (1 + adjustmentPercent / 100)
          : basePrice * (1 - adjustmentPercent / 100)

      scenarios.push({
        service_id: service.id,
        service_name: service.name,
        day: rule.day_of_week,
        hour: rule.hour_start,
        base_price: basePrice,
        adjusted_price: Number(adjustedPrice.toFixed(2)),
        adjustment_type: rule.adjustment_type,
        adjustment_percentage: adjustmentPercent,
      })

      const insight = insightsMap.get(service.id)
      if (!insight) continue
      insight.count += 1
      if (rule.adjustment_type === 'surge') {
        insight.peak.push(adjustedPrice)
      } else {
        insight.off.push(adjustedPrice)
      }
    }
  }

  const insights: DashboardInsight[] = services.map((service) => {
    const record = insightsMap.get(service.id)
    if (!record) {
      return {
        service_id: service.id,
        service_name: service.name,
        base_price: Number(service.price || 0),
        avg_off_peak_price: Number(service.price || 0),
        avg_peak_price: Number(service.price || 0),
        potential_revenue_increase: 0,
      }
    }

    const average = (values: number[]) =>
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : record.base

    const avgPeak = average(record.peak)
    const avgOffPeak = average(record.off)
    const potentialIncrease = (avgPeak - record.base) * estimatedBookings

    return {
      service_id: service.id,
      service_name: service.name,
      base_price: record.base,
      avg_off_peak_price: Number(avgOffPeak.toFixed(2)),
      avg_peak_price: Number(avgPeak.toFixed(2)),
      potential_revenue_increase: Number(Math.max(potentialIncrease, 0).toFixed(2)),
    }
  })

  return {
    rules: dashboardRules,
    scenarios,
    insights,
  }
}
