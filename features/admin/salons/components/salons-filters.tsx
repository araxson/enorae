'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

declare global {
  interface WindowEventMap {
    'admin:toggleFilters': CustomEvent<void>
    'admin:clearFilters': CustomEvent<void>
  }
}

interface SalonsFiltersProps {
  search: string
  onSearchChange: (search: string) => void
  tierFilter: string
  onTierChange: (tier: string) => void
  licenseFilter: 'all' | 'valid' | 'expiring' | 'expired' | 'unknown'
  onLicenseChange: (status: 'all' | 'valid' | 'expiring' | 'expired' | 'unknown') => void
  complianceFilter: 'all' | 'low' | 'medium' | 'high'
  onComplianceChange: (level: 'all' | 'low' | 'medium' | 'high') => void
}

export function SalonsFilters({
  search,
  onSearchChange,
  tierFilter,
  onTierChange,
  licenseFilter,
  onLicenseChange,
  complianceFilter,
  onComplianceChange,
}: SalonsFiltersProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleSearchChange = (value: string) => {
    onSearchChange(value)
  }

  const handleClearFilters = () => {
    onSearchChange('')
    onTierChange('all')
    onLicenseChange('all')
    onComplianceChange('all')
  }

  type LicenseValue = SalonsFiltersProps['licenseFilter']
  type ComplianceValue = SalonsFiltersProps['complianceFilter']

  useEffect(() => {
    const handleToggle = () => setCollapsed((previous) => !previous)
    const handleClear = (event?: Event) => {
      event?.preventDefault?.()
      handleClearFilters()
    }

    window.addEventListener('admin:toggleFilters', handleToggle)
    window.addEventListener('admin:clearFilters', handleClear)

    return () => {
      window.removeEventListener('admin:toggleFilters', handleToggle)
      window.removeEventListener('admin:clearFilters', handleClear)
    }
  }, [onSearchChange, onTierChange, onLicenseChange, onComplianceChange])

  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup aria-label="Actions">
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
        >
          {collapsed ? 'Show filters' : 'Hide filters'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear all filters
        </Button>
      </ButtonGroup>

      <FieldGroup className={`gap-6 lg:flex lg:items-end ${collapsed ? 'hidden md:flex' : ''}`}>
        <Field className="flex-1">
          <FieldLabel htmlFor="salons-search">Search salons</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="salons-search"
                type="search"
                placeholder="Search salons by name, business name, or slug..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Search salons directory"
                autoComplete="off"
              />
              <InputGroupAddon align="inline-end">
                {search ? (
                  <InputGroupButton
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Clear search"
                    onClick={() => handleSearchChange('')}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </InputGroupButton>
                ) : null}
              </InputGroupAddon>
            </InputGroup>
          </FieldContent>
        </Field>

        <Field className="w-full lg:w-40">
          <FieldLabel>Tier</FieldLabel>
          <FieldContent>
            <Select value={tierFilter} onValueChange={onTierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field className="w-full lg:w-40">
          <FieldLabel>License status</FieldLabel>
          <FieldContent>
            <Select value={licenseFilter} onValueChange={(value) => onLicenseChange(value as LicenseValue)}>
              <SelectTrigger>
                <SelectValue placeholder="License" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any license</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expiring">Expiring soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field className="w-full lg:w-44">
          <FieldLabel>Compliance risk</FieldLabel>
          <FieldContent>
            <Select value={complianceFilter} onValueChange={(value) => onComplianceChange(value as ComplianceValue)}>
              <SelectTrigger>
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="low">Low risk</SelectItem>
                <SelectItem value="medium">Monitor</SelectItem>
                <SelectItem value="high">High risk</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  )
}
