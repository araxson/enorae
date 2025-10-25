'use server'

import { updateUserProfile as updateUserProfileAction } from './mutations/profile'
import {
  suspendUser as suspendUserAction,
  reactivateUser as reactivateUserAction,
  banUser as banUserAction,
  batchUpdateUserStatus as batchUpdateUserStatusAction,
} from './mutations/status'
import {
  terminateSession as terminateSessionAction,
  terminateAllUserSessions as terminateAllUserSessionsAction,
} from './mutations/sessions'
import { deleteUserPermanently as deleteUserPermanentlyAction } from './mutations/delete'

type ServerAction<T extends (...args: never[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: never[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const updateUserProfile = createServerActionProxy(updateUserProfileAction)
export const suspendUser = createServerActionProxy(suspendUserAction)
export const reactivateUser = createServerActionProxy(reactivateUserAction)
export const banUser = createServerActionProxy(banUserAction)
export const batchUpdateUserStatus = createServerActionProxy(batchUpdateUserStatusAction)
export const terminateSession = createServerActionProxy(terminateSessionAction)
export const terminateAllUserSessions = createServerActionProxy(
  terminateAllUserSessionsAction
)
export const deleteUserPermanently = createServerActionProxy(deleteUserPermanentlyAction)
