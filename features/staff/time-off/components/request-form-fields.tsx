'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

type RequestFormFieldsProps = {
  requestType: string
  isAutoReschedule: boolean
  isNotifyCustomers: boolean
  onRequestTypeChange: (value: string) => void
  onAutoRescheduleChange: (checked: boolean) => void
  onNotifyCustomersChange: (checked: boolean) => void
}

export function RequestFormFields({
  requestType,
  isAutoReschedule,
  isNotifyCustomers,
  onRequestTypeChange,
  onAutoRescheduleChange,
  onNotifyCustomersChange,
}: RequestFormFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="startAt">Start date</FieldLabel>
          <FieldContent>
            <Input
              type="date"
              id="startAt"
              name="startAt"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="endAt">End date</FieldLabel>
          <FieldContent>
            <Input
              type="date"
              id="endAt"
              name="endAt"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="requestType">Request type</FieldLabel>
        <FieldContent>
          <Select value={requestType} onValueChange={onRequestTypeChange}>
            <SelectTrigger id="requestType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick_leave">Sick leave</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
        <FieldContent>
          <Textarea
            id="reason"
            name="reason"
            placeholder="Provide additional details about your request"
            rows={3}
          />
        </FieldContent>
      </Field>

      <FieldLegend>Notifications</FieldLegend>
      <FieldGroup className="space-y-2">
        <Field orientation="horizontal">
          <FieldLabel htmlFor="isAutoReschedule">
            Automatically reschedule affected appointments
          </FieldLabel>
          <FieldContent>
            <Checkbox
              id="isAutoReschedule"
              checked={isAutoReschedule}
              onCheckedChange={(checked) => onAutoRescheduleChange(Boolean(checked))}
            />
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="isNotifyCustomers">
            Notify customers about affected appointments
          </FieldLabel>
          <FieldContent>
            <Checkbox
              id="isNotifyCustomers"
              checked={isNotifyCustomers}
              onCheckedChange={(checked) => onNotifyCustomersChange(Boolean(checked))}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
