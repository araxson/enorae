'use server'

import { upsertServicePricing as upsertServicePricingAction } from './upsert-service-pricing.mutation'
import { deleteServicePricing as deleteServicePricingAction } from './delete-service-pricing.mutation'

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const upsertServicePricing = createServerActionProxy(upsertServicePricingAction)
export const deleteServicePricing = createServerActionProxy(deleteServicePricingAction)
