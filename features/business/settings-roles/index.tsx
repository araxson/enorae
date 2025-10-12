import { getUserRoles, getAvailableStaff } from './api/queries'
import { RolesClient } from './components/roles-client'

export async function RolesManagement() {
  const [roles, staff] = await Promise.all([
    getUserRoles(),
    getAvailableStaff(),
  ])

  return <RolesClient roles={roles} availableStaff={staff} />
}
