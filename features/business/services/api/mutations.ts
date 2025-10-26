'use server'

import { createService as createServiceAction } from './mutations/create-service.mutation'
import type {
  ServiceBookingRulesData,
  ServiceFormData,
  ServicePricingData,
} from './mutations/create-service.mutation'
import { updateService as updateServiceAction } from './mutations/update-service.mutation'
import { deleteService as deleteServiceAction } from './mutations/delete-service.mutation'
import { permanentlyDeleteService as permanentlyDeleteServiceAction } from './mutations/permanently-delete-service.mutation'

type ServerAction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>

function createServerActionProxy<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
): ServerAction<TArgs, TResult> {
  return (...args) => action(...args)
}

export const createService = createServerActionProxy(createServiceAction)
export const updateService = createServerActionProxy(updateServiceAction)
export const deleteService = createServerActionProxy(deleteServiceAction)
export const permanentlyDeleteService = createServerActionProxy(permanentlyDeleteServiceAction)

export type { ServiceFormData, ServicePricingData, ServiceBookingRulesData }
