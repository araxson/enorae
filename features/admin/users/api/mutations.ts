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

// Re-export server actions directly - they are already proper server actions
export const updateUserProfile = updateUserProfileAction
export const suspendUser = suspendUserAction
export const reactivateUser = reactivateUserAction
export const banUser = banUserAction
export const batchUpdateUserStatus = batchUpdateUserStatusAction
export const terminateSession = terminateSessionAction
export const terminateAllUserSessions = terminateAllUserSessionsAction
export const deleteUserPermanently = deleteUserPermanentlyAction
