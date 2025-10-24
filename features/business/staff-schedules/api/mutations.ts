'use server'

import { upsertStaffSchedule as upsertStaffScheduleAction } from './internal/mutations/upsert-staff-schedule.mutation'
import { deleteStaffSchedule as deleteStaffScheduleAction } from './internal/mutations/delete-staff-schedule.mutation'
import { toggleScheduleActive as toggleScheduleActiveAction } from './internal/mutations/toggle-schedule-active.mutation'
import type { ActionResponse, DayOfWeek } from './internal/mutations/shared'

type ServerAction<T extends (...args: any[]) => Promise<unknown>> = (
  ...args: Parameters<T>
) => ReturnType<T>

function createServerActionProxy<T extends (...args: any[]) => Promise<unknown>>(
  action: T
): ServerAction<T> {
  return (...args) => action(...args)
}

export const upsertStaffSchedule = createServerActionProxy(upsertStaffScheduleAction)
export const deleteStaffSchedule = createServerActionProxy(deleteStaffScheduleAction)
export const toggleScheduleActive = createServerActionProxy(toggleScheduleActiveAction)

export type { ActionResponse, DayOfWeek }
