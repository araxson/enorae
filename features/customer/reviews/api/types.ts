import type { Database } from '@/lib/types/database.types'

export type Review = Database['public']['Views']['salon_reviews_view']['Row']

export interface ReviewsListProps {
  reviews: Review[]
}
