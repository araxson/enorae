import { ANALYTICS_CONFIG } from '@/lib/config/constants'

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

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
const DEFAULT_BUSINESS_START_HOUR = 8
const DEFAULT_BUSINESS_END_HOUR = 18
const ALL_DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6]

/**
 * Parse time string (HH:MM format) to hour number
 * @param value - Time string in HH:MM format
 * @param fallback - Default hour to use if parsing fails
 * @returns Hour as number (0-23)
 */
const parseTime = (value: string | null, fallback: number): number => {
  if (!value) return fallback
  const [hour] = value.split(':').map(Number)
  return Number.isFinite(hour) && hour !== undefined ? hour : fallback
}

/**
 * Convert pricing rule to percentage adjustment
 * @param rule - Raw pricing rule from database
 * @returns Percentage adjustment (positive for surge, negative for discount)
 */
const toPercentage = (rule: RawPricingRule): number => {
  const MULTIPLIER_NEUTRAL_VALUE = 1
  const PERCENTAGE_MULTIPLIER = 100

  if (rule.multiplier && rule.multiplier !== MULTIPLIER_NEUTRAL_VALUE) {
    return (rule.multiplier - MULTIPLIER_NEUTRAL_VALUE) * PERCENTAGE_MULTIPLIER
  }
  if (rule.fixed_adjustment) {
    return rule.fixed_adjustment
  }
  return 0
}

/**
 * Build comprehensive pricing analytics including rules, scenarios, and insights
 * Used for dynamic pricing dashboard and revenue forecasting
 */
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
    const adjustmentType = percentage >= 0 ? 'surge' : 'discount'
    const operatingHours = {
      start: parseTime(rule.start_time, DEFAULT_BUSINESS_START_HOUR) ?? DEFAULT_BUSINESS_START_HOUR,
      end: parseTime(rule.end_time, DEFAULT_BUSINESS_END_HOUR) ?? DEFAULT_BUSINESS_END_HOUR,
    }

    const applicableDays = rule.days_of_week?.length ? rule.days_of_week : ALL_DAYS_OF_WEEK

    return applicableDays.map((dayIndex) => ({
      day_of_week: DAYS_OF_WEEK[dayIndex] ?? 'sunday',
      hour_start: operatingHours.start,
      hour_end: operatingHours.end,
      adjustment_type: adjustmentType,
      adjustment_percentage: Math.abs(percentage),
    }))
  })

  const scenarios: DashboardScenario[] = []
  const insightsMap = new Map<string, { base: number; peak: number[]; off: number[]; count: number }>()

  const ESTIMATED_BOOKINGS_PER_SERVICE = 25

  for (const service of services) {
    const basePrice = Number(service.price || 0)
    insightsMap.set(service.id, { base: basePrice, peak: [], off: [], count: 0 })

    for (const rule of dashboardRules) {
      const adjustmentPercent = rule.adjustment_percentage
      const PERCENTAGE_DIVISOR = 100
      const MULTIPLIER_NEUTRAL = 1

      const adjustedPrice =
        rule.adjustment_type === 'surge'
          ? basePrice * (MULTIPLIER_NEUTRAL + adjustmentPercent / PERCENTAGE_DIVISOR)
          : basePrice * (MULTIPLIER_NEUTRAL - adjustmentPercent / PERCENTAGE_DIVISOR)

      scenarios.push({
        service_id: service.id,
        service_name: service.name,
        day: rule.day_of_week,
        hour: rule.hour_start,
        base_price: basePrice,
        adjusted_price: Number(adjustedPrice.toFixed(ANALYTICS_CONFIG.PRICE_DECIMAL_PLACES)),
        adjustment_type: rule.adjustment_type,
        adjustment_percentage: adjustmentPercent,
      })

      const insightData = insightsMap.get(service.id)
      if (!insightData) continue
      insightData.count += 1
      if (rule.adjustment_type === 'surge') {
        insightData.peak.push(adjustedPrice)
      } else {
        insightData.off.push(adjustedPrice)
      }
    }
  }

  /**
   * Calculate average of number array, fallback to base if empty
   */
  const calculateAverage = (values: number[], fallbackBase: number): number =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallbackBase

  const insights: DashboardInsight[] = services.map((service) => {
    const insightRecord = insightsMap.get(service.id)
    const servicePriceBase = Number(service.price || 0)

    if (!insightRecord) {
      return {
        service_id: service.id,
        service_name: service.name,
        base_price: servicePriceBase,
        avg_off_peak_price: servicePriceBase,
        avg_peak_price: servicePriceBase,
        potential_revenue_increase: 0,
      }
    }

    const averagePeakPrice = calculateAverage(insightRecord.peak, insightRecord.base)
    const averageOffPeakPrice = calculateAverage(insightRecord.off, insightRecord.base)
    const potentialRevenueIncrease = (averagePeakPrice - insightRecord.base) * ESTIMATED_BOOKINGS_PER_SERVICE

    return {
      service_id: service.id,
      service_name: service.name,
      base_price: insightRecord.base,
      avg_off_peak_price: Number(averageOffPeakPrice.toFixed(ANALYTICS_CONFIG.PRICE_DECIMAL_PLACES)),
      avg_peak_price: Number(averagePeakPrice.toFixed(ANALYTICS_CONFIG.PRICE_DECIMAL_PLACES)),
      potential_revenue_increase: Number(Math.max(potentialRevenueIncrease, 0).toFixed(ANALYTICS_CONFIG.PRICE_DECIMAL_PLACES)),
    }
  })

  return {
    rules: dashboardRules,
    scenarios,
    insights,
  }
}
