'use client'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  StaffSelector,
  TimeRangeFields,
  DurationField,
} from './shared/service-form-fields'

interface EditServiceFormFieldsProps {
  serviceId: string
  formData: {
    staffId: string
    startTime: string
    endTime: string
    durationMinutes: string
    status: string
  }
  onFormDataChange: (data: Partial<EditServiceFormFieldsProps['formData']>) => void
  staff: Array<{ id: string; name: string }>
  isLoadingStaff: boolean
}

export function EditServiceFormFields({
  serviceId,
  formData,
  onFormDataChange,
  staff,
  isLoadingStaff,
}: EditServiceFormFieldsProps) {
  return (
    <>
      <Alert>
        <AlertDescription>
          Service ID: <span className="font-medium">{serviceId}</span>
        </AlertDescription>
      </Alert>

      <StaffSelector
        value={formData.staffId}
        onChange={(value) => onFormDataChange({ staffId: value })}
        staff={staff}
        isLoading={isLoadingStaff}
      />

      <TimeRangeFields
        startTime={formData.startTime}
        endTime={formData.endTime}
        onStartChange={(value) => onFormDataChange({ startTime: value })}
        onEndChange={(value) => onFormDataChange({ endTime: value })}
      />

      <DurationField
        value={formData.durationMinutes}
        onChange={(value) => onFormDataChange({ durationMinutes: value })}
      />

      <Field>
        <FieldLabel htmlFor="status">Status</FieldLabel>
        <FieldContent>
          <Select
            value={formData.status}
            onValueChange={(value) => onFormDataChange({ status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </>
  )
}
