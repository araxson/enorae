import type { OrderItem, Product } from '../types'

export const createEmptyOrderItem = (): OrderItem => ({
  productId: '',
  productName: '',
  quantity: 1,
  unitPrice: 0,
})

export const mapProductToOrderItem = (product: Product | undefined, current: OrderItem) => {
  return {
    ...current,
    productId: product?.id ?? '',
    productName: product?.name ?? '',
    unitPrice: product?.cost_price ?? 0,
  }
}

export const calculateOrderTotal = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

export const formatOrderItemTotal = (item: OrderItem) => (item.quantity * item.unitPrice).toFixed(2)
