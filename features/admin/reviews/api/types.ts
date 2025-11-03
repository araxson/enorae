import 'server-only'
import type { Database } from '@/lib/types/database.types'

export type AdminReview = Database['public']['Views']['admin_reviews_overview_view']['Row']
