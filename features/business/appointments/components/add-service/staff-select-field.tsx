import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StaffOption } from '@/features/business/appointments/api/queries/service-options'

type StaffSelectFieldProps = {
  value: string
  onChange: (value: string) => void
  staff: StaffOption[]
}

export function StaffSelectField({ value, onChange, staff }: StaffSelectFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="staff">Staff (Optional)</FieldLabel>
      <FieldContent>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any available</SelectItem>
            {staff.length > 0 ? (
              staff.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-staff" disabled>
                No staff available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  )
}
