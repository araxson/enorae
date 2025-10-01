import { Button } from '@enorae/ui'
import { getUserSalons } from '../dashboard/dal/dashboard.queries'
import { getStaffMembers } from './dal/staff.queries'
import { StaffList } from './components/staff-list'

export async function StaffManagement() {
  const salons = await getUserSalons()

  if (salons.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-muted-foreground">
            Please create a salon first before managing staff.
          </p>
        </div>
      </div>
    )
  }

  const selectedSalon = salons[0]
  const staff = await getStaffMembers(selectedSalon.id!)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground mt-1">{selectedSalon.name}</p>
        </div>
        <Button asChild>
          <a href="/business/staff/new">Add Staff Member</a>
        </Button>
      </div>

      <StaffList staff={staff} />
    </div>
  )
}