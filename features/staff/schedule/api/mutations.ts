'use server'

import {
  bulkCreateSchedules as bulkCreateSchedulesAction,
  createStaffSchedule as createStaffScheduleAction,
  deleteStaffSchedule as deleteStaffScheduleAction,
  updateStaffSchedule as updateStaffScheduleAction,
} from './staff-schedules'

type ServerAction<T extends (...args: any[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: any[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const createStaffSchedule = createServerActionProxy(createStaffScheduleAction)
export const updateStaffSchedule = createServerActionProxy(updateStaffScheduleAction)
export const deleteStaffSchedule = createServerActionProxy(deleteStaffScheduleAction)
export const bulkCreateSchedules = createServerActionProxy(bulkCreateSchedulesAction)