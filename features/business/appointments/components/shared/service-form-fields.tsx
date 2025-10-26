import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type StaffOption = {
  id: string
  name: string
}

type StaffSelectorProps = {
  value: string
  onChange: (value: string) => void
  staff: StaffOption[]
  isLoading: boolean
  required?: boolean
}

export function StaffSelector({
  value,
  onChange,
  staff,
  isLoading,
  required = false,
}: StaffSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="staff">Staff {!required && '(Optional)'}</Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue
            placeholder={isLoading ? 'Loading staff...' : 'Select staff member'}
          />
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
              {isLoading ? 'Loading staff...' : 'No staff available'}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

type TimeRangeFieldsProps = {
  startTime: string
  endTime: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
}

export function TimeRangeFields({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
}: TimeRangeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endTime">End Time</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </div>
    </div>
  )
}

type DurationFieldProps = {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function DurationField({ value, onChange, required = false }: DurationFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Duration (minutes) {required && '*'}</Label>
      <Input
        id="duration"
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., 60"
      />
    </div>
  )
}
