/**
 * Marketing Home Mutations
 *
 * NOTE: Newsletter subscription has been moved to @/features/marketing/newsletter/api/mutations
 * to break circular dependency between components/common and home feature.
 */

// Re-export newsletter subscription for backward compatibility
export { subscribeToNewsletter } from '@/features/marketing/newsletter/api/mutations'
