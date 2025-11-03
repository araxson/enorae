import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import type { Service, Staff } from '@/features/customer/booking/api/types'

interface ServiceStaffFieldsProps {
  services: Service[]
  staff: Staff[]
  selectedService: string
  selectedStaff: string
  onServiceChange: (value: string) => void
  onStaffChange: (value: string) => void
}

export function ServiceStaffFields({
  services,
  staff,
  selectedService,
  selectedStaff,
  onServiceChange,
  onStaffChange,
}: ServiceStaffFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="serviceId">Service</FieldLabel>
        <FieldContent>
          <Select
            name="serviceId"
            value={selectedService}
            onValueChange={onServiceChange}
            required
          >
            <SelectTrigger id="serviceId">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service['id'] || ''} value={service['id'] || ''}>
                  {service['name']}
                  {service['category_name'] ? ` (${service['category_name']})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="staffId">Staff member</FieldLabel>
        <FieldContent>
          <Select
            name="staffId"
            value={selectedStaff}
            onValueChange={onStaffChange}
            required
          >
            <SelectTrigger id="staffId">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staff.map((member) => (
                <SelectItem key={member['id'] || ''} value={member['id'] || ''}>
                  {member['title'] || 'Staff member'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </>
  )
}
