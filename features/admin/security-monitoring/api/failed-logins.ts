import { normalizeIp, toFailedLoginAttempt, type AuditLogViewRow } from './transformers'
import type { FailedLoginSummary } from './types'

export const groupFailedLogins = (rows: AuditLogViewRow[]): FailedLoginSummary => {
  const total = rows.length
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  let last24h = 0
  const byIp = new Map<string, number>()
  const byUser = new Map<string, number>()

  rows.forEach((row) => {
    const ip = normalizeIp(row.ip_address) ?? 'unknown'
    const userKey = row.user_id ?? 'anonymous'
    byIp.set(ip, (byIp.get(ip) ?? 0) + 1)
    byUser.set(userKey, (byUser.get(userKey) ?? 0) + 1)
    if (row.created_at && new Date(row.created_at).getTime() >= cutoff) {
      last24h += 1
    }
  })

  const toSortedArray = (source: Map<string, number>) =>
    Array.from(source.entries())
      .map(([label, attempts]) => ({ label, attempts }))
      .sort((a, b) => b.attempts - a.attempts)

  return {
    total,
    last24h,
    byIp: toSortedArray(byIp),
    byUser: toSortedArray(byUser),
    attempts: rows.map(toFailedLoginAttempt),
  }
}
