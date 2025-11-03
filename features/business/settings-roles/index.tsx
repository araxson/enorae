import { getUserRoles, getAvailableStaff } from './api/queries'
import { RolesClient } from './components'

export async function RolesManagement() {
  const [roles, staff] = await Promise.all([
    getUserRoles(),
    getAvailableStaff(),
  ])

  return <RolesClient roles={roles} availableStaff={staff} />
}
export * from './api/types'
