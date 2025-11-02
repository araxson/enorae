import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Moderation action enumeration
 */
export const moderationActionEnum = z.enum([
  'approve',
  'reject',
  'flag',
  'hide',
  'delete',
  'ban_author',
  'warn_author',
  'feature',
])

/**
 * Content type enumeration
 */
export const contentTypeEnum = z.enum(['review', 'message', 'comment', 'media', 'profile', 'other'])

/**
 * Moderation reason enumeration
 */
export const moderationReasonEnum = z.enum([
  'spam',
  'inappropriate_language',
  'harassment',
  'false_information',
  'copyright_violation',
  'personal_information',
  'off_topic',
  'duplicate',
  'other',
])

/**
 * Review response schema
 * For salon owners to respond to reviews
 */
export const reviewResponseSchema = z.object({
  review_id: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  response_text: z
    .string()
    .min(20, 'Response must be at least 20 characters to be meaningful')
    .max(1000, 'Response must be 1000 characters or fewer')
    .refine(
      (val) => {
        // Ensure response is professional (no excessive caps or special characters)
        const capsRatio = (val.match(/[A-Z]/g) || []).length / val.length
        return capsRatio < 0.5
      },
      {
        message: 'Please use a professional tone (avoid excessive capital letters)',
      }
    ),
  is_public: z.boolean().default(true),
  notify_reviewer: z.boolean().default(true),
})

/**
 * Review moderation schema
 * For moderating user reviews
 */
export const reviewModerationSchema = z.object({
  review_id: z.string().regex(UUID_REGEX, 'Invalid review ID'),
  action: moderationActionEnum,
  reason: moderationReasonEnum,
  moderator_notes: z
    .string()
    .min(10, 'Please provide detailed notes (at least 10 characters)')
    .max(1000, 'Notes must be 1000 characters or fewer'),
  notify_author: z.boolean().default(true),
  notification_message: z.string().max(500, 'Notification message must be 500 characters or fewer').optional(),
})

/**
 * Content flag schema
 * For users to report inappropriate content
 */
export const contentFlagSchema = z.object({
  content_id: z.string().regex(UUID_REGEX, 'Invalid content ID'),
  content_type: contentTypeEnum,
  flag_reason: moderationReasonEnum,
  description: z
    .string()
    .min(20, 'Please provide details about why you are flagging this content (at least 20 characters)')
    .max(1000, 'Description must be 1000 characters or fewer'),
  reporter_id: z.string().regex(UUID_REGEX, 'Invalid reporter ID').optional(),
})

/**
 * Ban user schema
 * For temporarily or permanently banning users
 */
export const banUserSchema = z.object({
  user_id: z.string().regex(UUID_REGEX, 'Invalid user ID'),
  reason: moderationReasonEnum,
  detailed_reason: z
    .string()
    .min(20, 'Please provide a detailed reason (at least 20 characters)')
    .max(1000, 'Reason must be 1000 characters or fewer'),
  ban_duration_days: z.coerce
    .number()
    .int('Duration must be whole days')
    .min(1, 'Ban duration must be at least 1 day')
    .max(3650, 'Ban duration cannot exceed 10 years')
    .optional(),
  is_permanent: z.boolean().default(false),
  block_ip: z.boolean().default(false),
  notify_user: z.boolean().default(true),
}).refine(
  (data) => {
    // Either duration or permanent must be set, but not both
    if (data.is_permanent && data.ban_duration_days) {
      return false
    }
    if (!data.is_permanent && !data.ban_duration_days) {
      return false
    }
    return true
  },
  {
    message: 'Must specify either ban duration OR permanent ban, not both',
    path: ['is_permanent'],
  }
)

/**
 * Bulk moderation schema
 * For moderating multiple items at once
 */
export const bulkModerationSchema = z.object({
  content_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid content ID'))
    .min(1, 'Select at least one item')
    .max(100, 'Cannot moderate more than 100 items at once'),
  content_type: contentTypeEnum,
  action: moderationActionEnum,
  reason: moderationReasonEnum,
  moderator_notes: z.string().max(1000, 'Notes must be 1000 characters or fewer'),
})

/**
 * Moderation queue filter schema
 * For filtering items in the moderation queue
 */
export const moderationQueueFilterSchema = z.object({
  content_type: contentTypeEnum.optional(),
  status: z.enum(['pending', 'flagged', 'approved', 'rejected', 'hidden']).optional(),
  flag_reason: moderationReasonEnum.optional(),
  flagged_after: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  flagged_before: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  reporter_id: z.string().regex(UUID_REGEX, 'Invalid reporter ID').optional(),
  author_id: z.string().regex(UUID_REGEX, 'Invalid author ID').optional(),
  min_flag_count: z.coerce.number().int('Must be a whole number').min(1).optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type ReviewResponseSchema = z.infer<typeof reviewResponseSchema>
export type ReviewModerationSchema = z.infer<typeof reviewModerationSchema>
export type ContentFlagSchema = z.infer<typeof contentFlagSchema>
export type BanUserSchema = z.infer<typeof banUserSchema>
export type BulkModerationSchema = z.infer<typeof bulkModerationSchema>
export type ModerationQueueFilterSchema = z.infer<typeof moderationQueueFilterSchema>
