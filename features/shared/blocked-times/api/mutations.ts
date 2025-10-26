'use server'

import { createBlockedTime as createBlockedTimeAction } from './mutations/create-blocked-time.mutation'
import { updateBlockedTime as updateBlockedTimeAction } from './mutations/update-blocked-time.mutation'
import { deleteBlockedTime as deleteBlockedTimeAction } from './mutations/delete-blocked-time.mutation'

type ServerAction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>

function createServerActionProxy<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
): ServerAction<TArgs, TResult> {
  return (...args) => action(...args)
}

export const createBlockedTime = createServerActionProxy(createBlockedTimeAction)
export const updateBlockedTime = createServerActionProxy(updateBlockedTimeAction)
export const deleteBlockedTime = createServerActionProxy(deleteBlockedTimeAction)
