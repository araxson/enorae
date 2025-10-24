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

type ServerAction<T extends (...args: any[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: any[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const createService = createServerActionProxy(createServiceAction)
export const updateService = createServerActionProxy(updateServiceAction)
export const deleteService = createServerActionProxy(deleteServiceAction)
export const permanentlyDeleteService = createServerActionProxy(permanentlyDeleteServiceAction)

export type { ServiceFormData, ServicePricingData, ServiceBookingRulesData }
