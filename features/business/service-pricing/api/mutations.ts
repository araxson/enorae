'use server'

import { upsertServicePricing as upsertServicePricingAction } from './upsert-service-pricing.mutation'
import { deleteServicePricing as deleteServicePricingAction } from './delete-service-pricing.mutation'

type ServerAction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>

function createServerActionProxy<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
): ServerAction<TArgs, TResult> {
  return (...args) => action(...args)
}

export const upsertServicePricing = createServerActionProxy(upsertServicePricingAction)
export const deleteServicePricing = createServerActionProxy(deleteServicePricingAction)
