import 'server-only'

import type { Database } from '@/lib/types/database.types'

type StaffProfileRow = Database['public']['Views']['staff_profiles_view']['Row']
type UserOverviewRow = Database['public']['Views']['admin_users_overview_view']['Row']

export type EnrichedStaffProfile = StaffProfileRow & {
  full_name: string | null
  email: string | null
  avatar_url: string | null
  status: string | null
  phone: string | null
}

export function mergeStaffWithUsers(
  staffRows: StaffProfileRow[] | null,
  userRows: UserOverviewRow[] | null,
): EnrichedStaffProfile[] {
  if (!staffRows?.length) {
    return []
  }

  const usersById = new Map<string, UserOverviewRow>()
  userRows?.forEach((user) => {
    const userId = user?.id
    if (userId) {
      usersById.set(userId, user)
    }
  })

  return staffRows.map((staffRow) => {
    const user = staffRow.user_id ? usersById.get(staffRow.user_id) : undefined

    return {
      ...staffRow,
      full_name: user?.full_name ?? null,
      email: user?.email ?? null,
      avatar_url: user?.avatar_url ?? null,
      status: user?.status ?? null,
      phone: null, // TODO: Add phone to user profile or staff profile
    }
  })
}
