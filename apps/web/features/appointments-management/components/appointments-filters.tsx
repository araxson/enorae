'use client'

import { Card, CardContent } from '@enorae/ui'
import { Button } from '@enorae/ui'
import { Input } from '@enorae/ui'
import { Label } from '@enorae/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@enorae/ui'

interface AppointmentsFiltersProps {
  onFilterChange: (filters: any) => void
}

export function AppointmentsFilters({ onFilterChange }: AppointmentsFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              onChange={(e) => onFilterChange({ date: e.target.value })}
            />
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => onFilterChange({ status: value })}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={() => onFilterChange({})}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}