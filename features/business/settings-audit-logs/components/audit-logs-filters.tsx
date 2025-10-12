'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
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
import { Grid, Stack, Flex } from '@/components/layout'
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
    <Card className="p-4">
      <Stack gap="md">
        <Flex justify="between" align="center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        </Flex>

        <Grid cols={{ base: 1, md: 2, lg: 5 }} gap="md">
          <div>
            <Label htmlFor="action">Action</Label>
            <Select value={filters.action} onValueChange={(v) => handleFilterChange('action', v)}>
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
            <Select value={filters.entityType} onValueChange={(v) => handleFilterChange('entityType', v)}>
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
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="isSuccess">Status</Label>
            <Select value={filters.isSuccess} onValueChange={(v) => handleFilterChange('isSuccess', v)}>
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
        </Grid>
      </Stack>
    </Card>
  )
}
