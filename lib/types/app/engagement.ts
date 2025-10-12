import type { Database } from '../database.types'

export type CustomerFavoriteView = Database['public']['Views']['customer_favorites']['Row']
export type CustomerFavorite = CustomerFavoriteView
