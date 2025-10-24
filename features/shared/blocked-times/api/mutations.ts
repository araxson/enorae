'use server'

import { createBlockedTime as createBlockedTimeAction } from './mutations/create-blocked-time.mutation'
import { updateBlockedTime as updateBlockedTimeAction } from './mutations/update-blocked-time.mutation'
import { deleteBlockedTime as deleteBlockedTimeAction } from './mutations/delete-blocked-time.mutation'

type ServerAction<T extends (...args: any[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: any[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const createBlockedTime = createServerActionProxy(createBlockedTimeAction)
export const updateBlockedTime = createServerActionProxy(updateBlockedTimeAction)
export const deleteBlockedTime = createServerActionProxy(deleteBlockedTimeAction)
