import type { Database } from '@/lib/types/database.types'

/**
 * Customer favorites types
 */

export type CustomerFavoriteView = Database['public']['Views']['customer_favorites_view']['Row']
export type CustomerFavorite = CustomerFavoriteView

export interface FavoritesState {}

export interface FavoritesParams {}
