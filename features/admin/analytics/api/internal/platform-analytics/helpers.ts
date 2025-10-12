import type { GrowthDelta, AcquisitionBreakdownItem } from '../admin-analytics-types'

export const toNumber = (value: number | null | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

export const computeDelta = (current: number, previous: number): GrowthDelta => {
  const delta = current - previous
  const deltaPercent = previous !== 0 ? delta / previous : 0
  return { current, previous, delta, deltaPercent }
}

export const sumMetric = <T>(rows: T[], selector: (row: T) => number): number =>
  rows.reduce((acc, row) => acc + selector(row), 0)

export const averageMetric = <T>(rows: T[], selector: (row: T) => number): number => {
  if (!rows.length) return 0
  return sumMetric(rows, selector) / rows.length
}

export const parseDate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const buildBreakdown = (
  rows: Array<{ key: string | null | undefined }>,
  total: number,
  normalize: (value: string | null | undefined) => string,
): AcquisitionBreakdownItem[] => {
  if (!rows.length || !total) return []

  const counts = new Map<string, number>()
  rows.forEach((row) => {
    const label = normalize(row.key)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  })

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, count]) => ({
      label,
      count,
      percentage: count / total,
    }))
}
