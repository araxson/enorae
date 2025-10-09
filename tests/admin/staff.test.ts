import { describe, expect, it } from 'vitest'
import {
  calculateComplianceScore,
  normalizeBackgroundStatus,
} from '@/features/admin/staff/utils/metrics'

const baseInput = {
  totalAppointments: 20,
  completedAppointments: 18,
  cancelledAppointments: 1,
  noShowAppointments: 1,
  flaggedReviews: 0,
  averageRating: 4.6,
  certificationsCount: 2,
}

describe('Staff metrics utilities', () => {
  it('normalises background statuses consistently', () => {
    expect(normalizeBackgroundStatus('Passed')).toBe('clear')
    expect(normalizeBackgroundStatus('pending')).toBe('pending')
    expect(normalizeBackgroundStatus('FLAGGED')).toBe('failed')
    expect(normalizeBackgroundStatus(undefined)).toBe('missing')
  })

  it('rewards well performing staff with high compliance scores', () => {
    const result = calculateComplianceScore({
      ...baseInput,
      backgroundCheckStatus: 'clear',
    })

    expect(result.score).toBeGreaterThanOrEqual(85)
    expect(result.status).toBe('compliant')
    expect(result.issues).toHaveLength(0)
  })

  it('penalises risky performance and missing verification', () => {
    const result = calculateComplianceScore({
      totalAppointments: 12,
      completedAppointments: 6,
      cancelledAppointments: 3,
      noShowAppointments: 3,
      flaggedReviews: 4,
      averageRating: 3.1,
      certificationsCount: 0,
      backgroundCheckStatus: 'missing',
    })

    expect(result.score).toBeLessThan(60)
    expect(result.status).toBe('critical')
    expect(result.issues).toContain('Background check missing')
    expect(result.issues).toContain('Low appointment completion rate')
  })
})
