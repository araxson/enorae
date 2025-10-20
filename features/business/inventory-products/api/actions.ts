'use server'

import { createProductMutation } from './mutations/create-product.mutation'
import { updateProductMutation } from './mutations/update-product.mutation'
import { deleteProductMutation } from './mutations/delete-product.mutation'
import { resolveStockAlertMutation } from './mutations/resolve-stock-alert.mutation'

export async function createProduct(
  ...args: Parameters<typeof createProductMutation>
) {
  return createProductMutation(...args)
}

export async function updateProduct(
  ...args: Parameters<typeof updateProductMutation>
) {
  return updateProductMutation(...args)
}

export async function deleteProduct(
  ...args: Parameters<typeof deleteProductMutation>
) {
  return deleteProductMutation(...args)
}

export async function resolveStockAlert(
  ...args: Parameters<typeof resolveStockAlertMutation>
) {
  return resolveStockAlertMutation(...args)
}
