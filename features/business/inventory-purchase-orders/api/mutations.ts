'use server'

import { createPurchaseOrderMutation } from './mutations/create-purchase-order.mutation'
import { updatePurchaseOrderStatusMutation } from './mutations/update-purchase-order-status.mutation'
import { receivePurchaseOrderItemsMutation } from './mutations/receive-purchase-order-items.mutation'
import { deletePurchaseOrderMutation } from './mutations/delete-purchase-order.mutation'

export async function createPurchaseOrder(
  ...args: Parameters<typeof createPurchaseOrderMutation>
) {
  return createPurchaseOrderMutation(...args)
}

export async function updatePurchaseOrderStatus(
  ...args: Parameters<typeof updatePurchaseOrderStatusMutation>
) {
  return updatePurchaseOrderStatusMutation(...args)
}

export async function receivePurchaseOrderItems(
  ...args: Parameters<typeof receivePurchaseOrderItemsMutation>
) {
  return receivePurchaseOrderItemsMutation(...args)
}

export async function deletePurchaseOrder(
  ...args: Parameters<typeof deletePurchaseOrderMutation>
) {
  return deletePurchaseOrderMutation(...args)
}
