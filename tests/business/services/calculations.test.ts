import test from 'node:test'
import assert from 'node:assert/strict'

import { deriveBookingDurations, derivePricingMetrics } from '@/features/business/services/api/utils/calculations'

test('derivePricingMetrics returns base price when no sale price provided', () => {
  const result = derivePricingMetrics(100)

  assert.equal(result.currentPrice, 100)
  assert.equal(result.salePrice, null)
  assert.equal(result.profitMargin, null)
})

test('derivePricingMetrics prefers sale price and computes profit margin', () => {
  const { currentPrice, salePrice, profitMargin } = derivePricingMetrics(120, 90, 30)

  assert.equal(currentPrice, 90)
  assert.equal(salePrice, 90)
  assert.equal(profitMargin, 66.67)
})

test('derivePricingMetrics handles zero cost gracefully', () => {
  const { profitMargin } = derivePricingMetrics(80, null, 0)

  assert.equal(profitMargin, 100)
})

test('derivePricingMetrics returns null profit margin when current price is zero', () => {
  const { profitMargin } = derivePricingMetrics(0, 0, 0)

  assert.equal(profitMargin, null)
})

test('deriveBookingDurations normalizes negative values to zero', () => {
  const result = deriveBookingDurations(-45, -15)

  assert.deepEqual(result, {
    durationMinutes: 0,
    bufferMinutes: 0,
    totalDurationMinutes: 0,
  })
})

test('deriveBookingDurations sums duration and buffer', () => {
  const result = deriveBookingDurations(60, 15)

  assert.deepEqual(result, {
    durationMinutes: 60,
    bufferMinutes: 15,
    totalDurationMinutes: 75,
  })
})
