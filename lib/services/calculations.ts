export function derivePricingMetrics(
  basePrice: number,
  salePrice?: number | null,
  cost?: number | null,
): {
  currentPrice: number
  salePrice: number | null
  profitMargin: number | null
} {
  const normalizedSale = salePrice != null ? salePrice : null
  const currentPrice = normalizedSale ?? basePrice

  const profitMargin = cost != null && currentPrice > 0
    ? Number((((currentPrice - cost) / currentPrice) * 100).toFixed(2))
    : null

  return {
    currentPrice,
    salePrice: normalizedSale,
    profitMargin,
  }
}

export function deriveBookingDurations(
  durationMinutes: number,
  bufferMinutes?: number | null,
): {
  durationMinutes: number
  bufferMinutes: number
  totalDurationMinutes: number
} {
  const safeDuration = Math.max(0, Number.isFinite(durationMinutes) ? durationMinutes : 0)
  const safeBuffer = Math.max(0, Number.isFinite(bufferMinutes ?? 0) ? bufferMinutes ?? 0 : 0)

  return {
    durationMinutes: safeDuration,
    bufferMinutes: safeBuffer,
    totalDurationMinutes: safeDuration + safeBuffer,
  }
}
