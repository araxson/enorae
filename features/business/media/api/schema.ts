import { z } from 'zod'

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Media type enumeration
 */
export const mediaTypeEnum = z.enum(['image', 'video', 'document'])


/**
 * Media category enumeration
 */
export const mediaCategoryEnum = z.enum([
  'profile_photo',
  'cover_photo',
  'portfolio',
  'before_after',
  'facility',
  'staff_photo',
  'product',
  'certificate',
  'menu',
  'other',
])


/**
 * Image MIME types
 */
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
type ImageMimeType = typeof IMAGE_MIME_TYPES[number]

/**
 * Video MIME types
 */
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'] as const
type VideoMimeType = typeof VIDEO_MIME_TYPES[number]

/**
 * Document MIME types
 */
const DOCUMENT_MIME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as const
type DocumentMimeType = typeof DOCUMENT_MIME_TYPES[number]

type ValidMimeType = ImageMimeType | VideoMimeType | DocumentMimeType

/**
 * Type guard to check if a string is a valid MIME type
 */
function isValidMimeType(type: string): type is ValidMimeType {
  const validTypes: readonly string[] = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES, ...DOCUMENT_MIME_TYPES]
  return validTypes.includes(type)
}

/**
 * Type guard to check if a string is an image MIME type
 */
function isImageMimeType(type: string): type is ImageMimeType {
  return (IMAGE_MIME_TYPES as readonly string[]).includes(type)
}

/**
 * Type guard to check if a string is a video MIME type
 */
function isVideoMimeType(type: string): type is VideoMimeType {
  return (VIDEO_MIME_TYPES as readonly string[]).includes(type)
}

/**
 * Type guard to check if a string is a document MIME type
 */
function isDocumentMimeType(type: string): type is DocumentMimeType {
  return (DOCUMENT_MIME_TYPES as readonly string[]).includes(type)
}

/**
 * File size limits (in bytes)
 */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100 MB
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024 // 5 MB

/**
 * Media upload schema
 * Validates file uploads (client-side pre-validation)
 */
export const mediaUploadSchema = z.object({
  file_name: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name is too long')
    .refine(
      (name) => {
        // Ensure valid file extension
        return /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov|pdf|doc|docx)$/i.test(name)
      },
      {
        message: 'File type not supported',
      }
    ),
  file_size: z.coerce
    .number()
    .int('File size must be a whole number')
    .min(1, 'File is empty')
    .max(MAX_VIDEO_SIZE, 'File is too large'),
  mime_type: z.string().refine(
    (type) => isValidMimeType(type),
    {
      message: 'File type not supported',
    }
  ),
  category: mediaCategoryEnum,
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long').optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer').optional(),
  alt_text: z.string().max(200, 'Alt text must be 200 characters or fewer').optional(),
  tags: z
    .array(z.string().min(2, 'Tag must be at least 2 characters').max(50, 'Tag is too long'))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
  is_public: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int('Display order must be a whole number').min(0).optional(),
}).refine(
  (data) => {
    // Validate file size based on type
    if (isImageMimeType(data.mime_type)) {
      return data.file_size <= MAX_IMAGE_SIZE
    }
    if (isVideoMimeType(data.mime_type)) {
      return data.file_size <= MAX_VIDEO_SIZE
    }
    if (isDocumentMimeType(data.mime_type)) {
      return data.file_size <= MAX_DOCUMENT_SIZE
    }
    return true
  },
  {
    message: 'File exceeds maximum size for its type',
    path: ['file_size'],
  }
)

/**
 * Media metadata update schema
 * For updating media information without re-uploading
 */
export const mediaMetadataSchema = z.object({
  media_id: z.string().regex(UUID_REGEX, 'Invalid media ID'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long').optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer').optional(),
  alt_text: z.string().max(200, 'Alt text must be 200 characters or fewer').optional(),
  category: mediaCategoryEnum.optional(),
  tags: z
    .array(z.string().min(2, 'Tag must be at least 2 characters').max(50, 'Tag is too long'))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
  is_public: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  display_order: z.coerce.number().int('Display order must be a whole number').min(0).optional(),
})

/**
 * Portfolio entry schema
 * For showcasing work (before/after photos, etc.)
 */
export const portfolioEntrySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description must be 1000 characters or fewer').optional(),
  service_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid service ID'))
    .max(10, 'Maximum 10 services allowed')
    .optional(),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  before_image_id: z.string().regex(UUID_REGEX, 'Invalid image ID').optional(),
  after_image_id: z.string().regex(UUID_REGEX, 'Invalid image ID'),
  additional_image_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid image ID'))
    .max(10, 'Maximum 10 additional images allowed')
    .optional(),
  tags: z
    .array(z.string().min(2, 'Tag must be at least 2 characters').max(50, 'Tag is too long'))
    .max(20, 'Maximum 20 tags allowed')
    .optional(),
  is_public: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int('Display order must be a whole number').min(0).optional(),
})

/**
 * Bulk media delete schema
 * For deleting multiple media items at once
 */
export const bulkMediaDeleteSchema = z.object({
  media_ids: z
    .array(z.string().regex(UUID_REGEX, 'Invalid media ID'))
    .min(1, 'Select at least one media item')
    .max(100, 'Cannot delete more than 100 items at once'),
  confirm_deletion: z.literal(true),
})

/**
 * Media search/filter schema
 */
export const mediaSearchSchema = z.object({
  query: z.string().max(200, 'Search query is too long').optional(),
  category: mediaCategoryEnum.optional(),
  media_type: mediaTypeEnum.optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags for filtering').optional(),
  is_public: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  staff_id: z.string().regex(UUID_REGEX, 'Invalid staff ID').optional(),
  uploaded_after: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  uploaded_before: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
})

/**
 * Inferred TypeScript types from schemas
 */
export type MediaUploadSchema = z.infer<typeof mediaUploadSchema>
export type MediaMetadataSchema = z.infer<typeof mediaMetadataSchema>
export type PortfolioEntrySchema = z.infer<typeof portfolioEntrySchema>
export type BulkMediaDeleteSchema = z.infer<typeof bulkMediaDeleteSchema>
export type MediaSearchSchema = z.infer<typeof mediaSearchSchema>
