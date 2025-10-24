'use server'

import {
  assignServiceToStaff as assignServiceToStaffAction,
  unassignServiceFromStaff as unassignServiceFromStaffAction,
} from './internal/assign'
import { bulkAssignServices as bulkAssignServicesAction } from './internal/bulk'

type ServerAction<T extends (...args: any[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: any[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const assignServiceToStaff = createServerActionProxy(assignServiceToStaffAction)
export const unassignServiceFromStaff = createServerActionProxy(unassignServiceFromStaffAction)
export const bulkAssignServices = createServerActionProxy(bulkAssignServicesAction)
