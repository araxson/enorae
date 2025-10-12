import type { Database } from '@/lib/types/database.types'

export type Supplier = Database['public']['Views']['suppliers']['Row']

export type Product = {
  id: string
  name: string | null
  cost_price: number | null
}

export type OrderItem = {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}
