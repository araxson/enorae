import { SPAM_THRESHOLD, TOXICITY_THRESHOLD } from './constants'
import type { Json } from './types'
import type { ParsedModeration, ParsedThreadMetadata } from './types'

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const parseModeration = (metadata: Json | null): ParsedModeration => {
  if (!isObject(metadata)) {
    return { isFlagged: false, reason: '', severity: 'low', status: 'clean' }
  }

  const moderation = isObject(metadata['moderation']) ? (metadata['moderation'] as Record<string, unknown>) : undefined
  const spamScore =
    typeof metadata['spam_score'] === 'number'
      ? metadata['spam_score']
      : typeof moderation?.['spam_score'] === 'number'
        ? (moderation['spam_score'] as number)
        : null
  const toxicityScore =
    typeof metadata['toxicity_score'] === 'number'
      ? metadata['toxicity_score']
      : typeof moderation?.['toxicity'] === 'number'
        ? (moderation['toxicity'] as number)
        : null
  const flaggedCategories = Array.isArray(moderation?.['categories'])
    ? (moderation!['categories'] as unknown[]).filter((item) => typeof item === 'string')
    : undefined

  const baseReason =
    (typeof metadata['flagged_reason'] === 'string' ? metadata['flagged_reason'] : undefined) ??
    (typeof moderation?.['reason'] === 'string' ? moderation['reason'] : undefined) ??
    (typeof moderation?.['label'] === 'string' ? moderation['label'] : undefined) ??
    (flaggedCategories && flaggedCategories.length > 0 ? flaggedCategories.join(', ') : undefined)

  const flaggedExplicit = metadata['is_flagged'] === true || metadata['flagged'] === true || moderation?.['flagged'] === true

  const spamFlagged = typeof spamScore === 'number' && spamScore >= SPAM_THRESHOLD
  const toxicityFlagged = typeof toxicityScore === 'number' && toxicityScore >= TOXICITY_THRESHOLD
  const categoryFlagged = Boolean(
    flaggedCategories &&
      flaggedCategories.some((category) => {
        const value = category.toLowerCase()
        return value.includes('abuse') || value.includes('harassment') || value.includes('spam')
      }),
  )

  const isFlagged = Boolean(flaggedExplicit || spamFlagged || toxicityFlagged || categoryFlagged)

  let severity: ParsedModeration['severity'] = 'low'
  if (typeof toxicityScore === 'number' && toxicityScore >= 0.92) {
    severity = 'high'
  } else if (typeof spamScore === 'number' && spamScore >= 0.95) {
    severity = 'high'
  } else if (toxicityFlagged || spamFlagged || categoryFlagged) {
    severity = 'medium'
  }

  const status =
    typeof moderation?.['status'] === 'string'
      ? moderation['status']
      : isFlagged
        ? 'pending_review'
        : 'clean'

  return {
    isFlagged,
    reason: baseReason ?? (spamFlagged ? 'Spam indicators' : toxicityFlagged ? 'Toxicity indicators' : 'Flagged content'),
    severity,
    status,
  }
}

export const parseThreadMetadata = (metadata: Json | null): ParsedThreadMetadata => {
  if (!isObject(metadata)) {
    return { totalReports: 0, openReports: 0, pendingReports: 0 }
  }

  const reports = Array.isArray(metadata['reports']) ? (metadata['reports'] as unknown[]).filter(isObject) : []

  const totalReports = reports.length
  const openReports = reports.filter((report) => {
    const status = typeof report['status'] === 'string' ? report['status'].toLowerCase() : 'open'
    return !['resolved', 'closed', 'dismissed'].includes(status)
  }).length

  const moderationStatus = (() => {
    if (typeof metadata['moderation_status'] === 'string') return metadata['moderation_status']
    if (isObject(metadata['moderation']) && typeof metadata['moderation']['status'] === 'string') {
      return metadata['moderation']['status']
    }
    return null
  })()

  const pendingReports = moderationStatus && moderationStatus !== 'resolved' ? 1 : 0

  return {
    totalReports,
    openReports,
    pendingReports,
  }
}

export { isObject }
