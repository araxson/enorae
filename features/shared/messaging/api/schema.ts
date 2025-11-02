import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Message type enumeration
 */
export const messageTypeEnum = z.enum(['text', 'system', 'appointment', 'notification'])

/**
 * Message priority enumeration
 */
export const messagePriorityEnum = z.enum(['low', 'normal', 'high', 'urgent'])

/**
 * Message status enumeration
 */
export const messageStatusEnum = z.enum(['sent', 'delivered', 'read', 'failed'])

/**
 * Message composition schema
 * For sending messages between users
 */
export const messageCompositionSchema = z.object({
  recipient_id: z.string().regex(UUID_REGEX, 'Invalid recipient ID'),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be 200 characters or fewer')
    .optional(),
  body: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message must be 5000 characters or fewer')
    .refine(
      (val) => {
        // Ensure message isn't just spaces or line breaks
        const trimmed = val.trim()
        return trimmed.length > 0
      },
      {
        message: 'Message cannot be empty or only whitespace',
      }
    ),
  message_type: messageTypeEnum.default('text'),
  priority: messagePriorityEnum.default('normal'),
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID').optional(),
  attachment_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid attachment ID'))
    .max(10, 'Maximum 10 attachments allowed')
    .optional(),
  reply_to_message_id: z.string().regex(UUID_REGEX, 'Invalid message ID').optional(),
  request_read_receipt: z.boolean().default(false),
})

/**
 * Message thread schema
 * For starting a new conversation thread
 */
export const messageThreadSchema = z.object({
  participant_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid participant ID'))
    .min(1, 'At least one participant is required')
    .max(10, 'Maximum 10 participants allowed'),
  thread_name: z.string().min(3, 'Thread name must be at least 3 characters').max(200, 'Name is too long').optional(),
  initial_message: z
    .string()
    .min(1, 'Initial message cannot be empty')
    .max(5000, 'Message must be 5000 characters or fewer'),
  is_group: z.boolean().default(false),
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID').optional(),
})

/**
 * Message search schema
 * For searching through messages
 */
export const messageSearchSchema = z.object({
  query: z.string().max(200, 'Search query is too long').optional(),
  sender_id: z.string().regex(UUID_REGEX, 'Invalid sender ID').optional(),
  recipient_id: z.string().regex(UUID_REGEX, 'Invalid recipient ID').optional(),
  message_type: messageTypeEnum.optional(),
  priority: messagePriorityEnum.optional(),
  is_read: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  has_attachments: z.boolean().optional(),
  sent_after: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  sent_before: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  appointment_id: z.string().regex(UUID_REGEX, 'Invalid appointment ID').optional(),
})

/**
 * Message action schema
 * For marking messages as read, archived, deleted, etc.
 */
export const messageActionSchema = z.object({
  message_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid message ID'))
    .min(1, 'Select at least one message')
    .max(100, 'Cannot act on more than 100 messages at once'),
  action: z.enum(['read', 'unread', 'archive', 'unarchive', 'delete', 'star', 'unstar']),
})

/**
 * Message template schema
 * For creating reusable message templates
 */
export const messageTemplateSchema = z.object({
  name: z.string().min(3, 'Template name must be at least 3 characters').max(200, 'Name is too long'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject is too long').optional(),
  body_template: z
    .string()
    .min(10, 'Template body must be at least 10 characters')
    .max(5000, 'Template must be 5000 characters or fewer')
    .refine(
      (val) => {
        // Ensure template contains at least one variable placeholder
        return /\{\{[a-zA-Z0-9_]+\}\}/.test(val)
      },
      {
        message: 'Template must contain at least one variable placeholder (e.g., {{customer_name}})',
      }
    ),
  category: z.string().max(50, 'Category is too long').optional(),
  is_active: z.boolean().default(true),
  variables: z
    .array(
      z.object({
        name: z.string().min(1, 'Variable name is required'),
        description: z.string().max(200, 'Description is too long').optional(),
      })
    )
    .max(20, 'Maximum 20 variables allowed')
    .optional(),
})

/**
 * Bulk message send schema
 * For sending the same message to multiple recipients
 */
export const bulkMessageSendSchema = z.object({
  recipient_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid recipient ID'))
    .min(1, 'At least one recipient is required')
    .max(100, 'Cannot send to more than 100 recipients at once'),
  subject: z.string().min(3, 'Subject is required').max(200, 'Subject is too long').optional(),
  body: z.string().min(1, 'Message is required').max(5000, 'Message is too long'),
  message_type: messageTypeEnum.default('text'),
  priority: messagePriorityEnum.default('normal'),
  send_individually: z.boolean().default(true),
})

/**
 * Inferred TypeScript types from schemas
 */
export type MessageCompositionSchema = z.infer<typeof messageCompositionSchema>
export type MessageThreadSchema = z.infer<typeof messageThreadSchema>
export type MessageSearchSchema = z.infer<typeof messageSearchSchema>
export type MessageActionSchema = z.infer<typeof messageActionSchema>
export type MessageTemplateSchema = z.infer<typeof messageTemplateSchema>
export type BulkMessageSendSchema = z.infer<typeof bulkMessageSendSchema>
