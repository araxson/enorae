import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

interface BlockTypeSelectProps {
  value: string
  onChange: (value: string) => void
}

const BLOCK_TYPES = [
  { value: 'other', label: 'Other' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'personal', label: 'Personal' },
  { value: 'break', label: 'Break' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'sick_leave', label: 'Sick leave' },
  { value: 'training', label: 'Training' },
]

export function BlockTypeSelect({ value, onChange }: BlockTypeSelectProps) {
  return (
    <Field>
      <FieldLabel htmlFor="block_type">Block type</FieldLabel>
      <FieldContent>
        <Select name="block_type" value={value} onValueChange={onChange}>
          <SelectTrigger id="block_type">
            <SelectValue placeholder="Select block type" />
          </SelectTrigger>
          <SelectContent>
            {BLOCK_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  )
}
