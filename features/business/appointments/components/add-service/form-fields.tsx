import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { ServiceOption, StaffOption, ServiceFormData } from './types'

interface FormFieldsProps {
  formData: ServiceFormData
  setFormData: React.Dispatch<React.SetStateAction<ServiceFormData>>
  isLoadingOptions: boolean
  services: ServiceOption[]
  staff: StaffOption[]
}

export function FormFields({
  formData,
  setFormData,
  isLoadingOptions,
  services,
  staff,
}: FormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="service">Service *</Label>
        <Select
          value={formData.serviceId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, serviceId: value }))
          }
          disabled={isLoadingOptions}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingOptions ? 'Loading services...' : 'Select a service'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {services.length > 0 ? (
                services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-services" disabled>
                  {isLoadingOptions ? 'Loading services...' : 'No services available'}
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="staff">Staff (Optional)</Label>
        <Select
          value={formData.staffId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, staffId: value }))
          }
          disabled={isLoadingOptions}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingOptions ? 'Loading staff...' : 'Select staff member'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="">Any available</SelectItem>
              {staff.length > 0 ? (
                staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-staff" disabled>
                  {isLoadingOptions ? 'Loading staff...' : 'No staff available'}
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, startTime: event.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, endTime: event.target.value }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          value={formData.durationMinutes}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, durationMinutes: event.target.value }))
          }
          placeholder="e.g., 60"
        />
      </div>
    </>
  )
}
