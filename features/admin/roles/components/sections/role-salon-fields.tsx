import type { RoleValue } from '../../api/types'

type RoleSalonFieldsProps = {
  selectedRole: RoleValue | ''
  onRoleChange: (value: RoleValue | '') => void
  needsSalon: boolean
  salons: Array<{ id: string; name: string }>
  errors?: Record<string, string[]>
}

const ROLES_NEEDING_SALON: RoleValue[] = [
  'tenant_owner',
  'salon_owner',
  'salon_manager',
  'senior_staff',
  'staff',
  'junior_staff',
]

export function RoleSalonFields({
  selectedRole,
  onRoleChange,
  needsSalon,
  salons,
  errors,
}: RoleSalonFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-2">
          Role
          <span className="text-destructive" aria-label="required"> *</span>
        </label>
        <select
          id="role"
          name="role"
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value as RoleValue)}
          required
          aria-required="true"
          aria-invalid={!!errors?.['role']}
          aria-describedby={errors?.['role'] ? 'role-error' : undefined}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a role</option>
          <option value="platform_admin">Platform Admin</option>
          <option value="tenant_owner">Tenant Owner</option>
          <option value="salon_owner">Salon Owner</option>
          <option value="salon_manager">Salon Manager</option>
          <option value="senior_staff">Senior Staff</option>
          <option value="staff">Staff</option>
          <option value="junior_staff">Junior Staff</option>
          <option value="customer">Customer</option>
        </select>
        {errors?.['role'] && (
          <p id="role-error" className="text-sm text-destructive mt-1" role="alert">
            {errors['role'][0]}
          </p>
        )}
      </div>

      {needsSalon && (
        <div>
          <label htmlFor="salonId" className="block text-sm font-medium mb-2">
            Salon
            <span className="text-destructive" aria-label="required"> *</span>
          </label>
          <select
            id="salonId"
            name="salonId"
            required={needsSalon}
            aria-required={needsSalon}
            aria-invalid={!!errors?.['salonId']}
            aria-describedby={
              errors?.['salonId'] ? 'salonId-error salonId-hint' : 'salonId-hint'
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a salon</option>
            {salons.map((salon) => (
              <option key={salon.id} value={salon.id}>
                {salon.name}
              </option>
            ))}
          </select>
          <p id="salonId-hint" className="text-sm text-muted-foreground mt-1">
            Required for this role type
          </p>
          {errors?.['salonId'] && (
            <p id="salonId-error" className="text-sm text-destructive mt-1" role="alert">
              {errors['salonId'][0]}
            </p>
          )}
        </div>
      )}
    </>
  )
}
