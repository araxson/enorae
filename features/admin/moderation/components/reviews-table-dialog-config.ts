/**
 * Dialog configuration helper for reviews moderation actions
 */

import type { ModerationReview } from '../api/queries'

export type DialogType = 'flag' | 'unflag' | 'feature' | 'delete'

export type DialogConfig = {
  title: string
  description: string
  reviewLabel: string
}

export function getDialogConfig(
  type: DialogType,
  review: ModerationReview
): DialogConfig {
  const reviewLabel = review.customer_name || review.customer_email || 'Review'

  const titles: Record<DialogType, string> = {
    flag: 'Flag Review',
    unflag: 'Remove Flag from Review',
    feature: review.is_featured ? 'Unfeature Review' : 'Feature Review',
    delete: 'Delete Review',
  }

  const descriptions: Record<DialogType, string> = {
    flag: 'Flagging will move the review into the moderation queue for additional review.',
    unflag: 'This will remove the moderation flag and return the review to normal visibility.',
    feature: review.is_featured
      ? 'This will remove the review from featured placements.'
      : 'Featuring will highlight this review across the platform.',
    delete: 'This will permanently delete the review and cannot be undone.',
  }

  return {
    title: titles[type],
    description: descriptions[type],
    reviewLabel,
  }
}
