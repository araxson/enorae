'use server'

import { COUPONS_UNSUPPORTED_MESSAGE } from '../messages'
import { createOperationLogger, logMutation, logError } from '@/lib/observability'

export async function createCoupon(..._args: unknown[]): Promise<never> {
  const logger = createOperationLogger('createCoupon', {})
  logger.start()

  return Promise.reject(new Error(COUPONS_UNSUPPORTED_MESSAGE))
}

export async function updateCoupon(..._args: unknown[]): Promise<never> {
  return Promise.reject(new Error(COUPONS_UNSUPPORTED_MESSAGE))
}

export async function deleteCoupon(..._args: unknown[]): Promise<never> {
  return Promise.reject(new Error(COUPONS_UNSUPPORTED_MESSAGE))
}

export async function toggleCouponStatus(..._args: unknown[]): Promise<never> {
  return Promise.reject(new Error(COUPONS_UNSUPPORTED_MESSAGE))
}

export async function applyCoupon(..._args: unknown[]): Promise<never> {
  return Promise.reject(new Error(COUPONS_UNSUPPORTED_MESSAGE))
}

export async function bulkGenerateCoupons(..._args: unknown[]): Promise<never> {
  return Promise.reject(new Error(COUPONS_UNSUPPORTED_MESSAGE))
}
