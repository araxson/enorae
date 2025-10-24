'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, X } from 'lucide-react'

export interface AuditLogFilters {
  action: string
  entityType: string
  startDate: string
  endDate: string
  isSuccess: string
}

interface AuditLogsFiltersProps {
  onFilterChange: (filters: AuditLogFilters) => void
}

export function AuditLogsFilters({ onFilterChange }: AuditLogsFiltersProps) {
  const [filters, setFilters] = useState<AuditLogFilters>({
    action: '',
    entityType: '',
    startDate: '',
    endDate: '',
    isSuccess: ''
  })

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: AuditLogFilters = {
      action: '',
      entityType: '',
      startDate: '',
      endDate: '',
      isSuccess: ''
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <CardTitle>Filters</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label htmlFor="action">Action</Label>
          <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
            <SelectTrigger id="action">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="entityType">Entity Type</Label>
          <Select
            value={filters.entityType}
            onValueChange={(value) => handleFilterChange('entityType', value)}
          >
            <SelectTrigger id="entityType">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(event) => handleFilterChange('startDate', event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(event) => handleFilterChange('endDate', event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="isSuccess">Status</Label>
          <Select
            value={filters.isSuccess}
            onValueChange={(value) => handleFilterChange('isSuccess', value)}
          >
            <SelectTrigger id="isSuccess">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="true">Success</SelectItem>
              <SelectItem value="false">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
