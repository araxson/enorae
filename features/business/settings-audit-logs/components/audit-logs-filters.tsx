'use client'

import { useState } from 'react'
import { Item, ItemActions, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, X } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

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
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader>
        <ItemTitle>
          <Filter className="size-4" />
          Filters
        </ItemTitle>
        <ItemActions>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="size-4" />
            Clear
          </Button>
        </ItemActions>
      </ItemHeader>
      <ItemContent>
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Field>
              <FieldLabel htmlFor="action">Action</FieldLabel>
              <FieldContent>
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
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="entityType">Entity Type</FieldLabel>
              <FieldContent>
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
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
              <FieldContent>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(event) => handleFilterChange('startDate', event.target.value)}
                />
              </FieldContent>
              <FieldDescription>Filter logs from this date forward.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="endDate">End Date</FieldLabel>
              <FieldContent>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(event) => handleFilterChange('endDate', event.target.value)}
                />
              </FieldContent>
              <FieldDescription>Limit results up to this date.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="isSuccess">Status</FieldLabel>
              <FieldContent>
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
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </ItemContent>
    </Item>
  )
}
