import { describe, expect, it } from 'vitest'
import { calculateHealthScore, computeCompliance } from '@/features/admin/salons/utils/scoring'

describe('Salon compliance scoring', () => {
  it('rewards verified salons with valid licenses and positive metrics', () => {
    const result = computeCompliance({
      isVerified: true,
      licenseStatus: 'valid',
      ratingAverage: 4.6,
      totalBookings: 150,
      totalRevenue: 120000,
      employeeCount: 12,
      maxStaff: 15,
    })

    expect(result.score).toBeGreaterThanOrEqual(85)
    expect(result.level).toBe('low')
    expect(result.issues.length).toBe(0)
  })

  it('detects high risk scenarios such as expired licenses and low ratings', () => {
    const result = computeCompliance({
      isVerified: false,
      licenseStatus: 'expired',
      ratingAverage: 2.8,
      totalBookings: 2,
      totalRevenue: 1000,
      employeeCount: 10,
      maxStaff: 5,
    })

    expect(result.score).toBeLessThan(60)
    expect(result.level).toBe('high')
    expect(result.issues).toContain('License expired')
    expect(result.issues).toContain('Verification pending')
  })
})

describe('Salon health score', () => {
  it('calculates a balanced health score based on metrics', () => {
    const score = calculateHealthScore({
      ratingAverage: 4.2,
      totalBookings: 180,
      totalRevenue: 90000,
      employeeCount: 10,
      maxStaff: 12,
    })

    expect(score).toBeGreaterThan(60)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('returns low scores for poor performance', () => {
    const score = calculateHealthScore({
      ratingAverage: 2.5,
      totalBookings: 5,
      totalRevenue: 5000,
      employeeCount: 3,
      maxStaff: 10,
    })

    expect(score).toBeLessThan(40)
  })
})
