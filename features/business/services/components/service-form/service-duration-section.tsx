'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ServiceDurationSectionProps {
  duration: string
  buffer: string
  onDurationChange: (value: string) => void
  onBufferChange: (value: string) => void
}

export function ServiceDurationSection({
  duration,
  buffer,
  onDurationChange,
  onBufferChange,
}: ServiceDurationSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-medium">Duration & Booking</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration * (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="5"
            max="480"
            value={duration}
            onChange={(event) => onDurationChange(event.target.value)}
            required
            placeholder="60"
          />
        </div>

        <div>
          <Label htmlFor="buffer">Buffer Time (minutes)</Label>
          <Input
            id="buffer"
            type="number"
            min="0"
            max="60"
            value={buffer}
            onChange={(event) => onBufferChange(event.target.value)}
            placeholder="15"
          />
          <p className="text-xs text-muted-foreground mt-1">Time between appointments</p>
        </div>
      </div>
    </section>
  )
}
