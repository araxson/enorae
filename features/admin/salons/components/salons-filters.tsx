'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { Flex, Stack } from '@/components/layout'
import { Button } from '@/components/ui/button'

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
    <Stack gap="sm">
      <Flex justify="between" className="items-center">
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
      </Flex>

      <Flex gap="md" className={`flex-col lg:flex-row ${collapsed ? 'hidden md:flex' : ''}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search salons by name, business name, or slug..."
            value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={tierFilter} onValueChange={onTierChange}>
        <SelectTrigger className="w-full lg:w-[160px]">
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

      <Select value={licenseFilter} onValueChange={(value) => onLicenseChange(value as LicenseValue)}>
        <SelectTrigger className="w-full lg:w-[160px]">
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

      <Select value={complianceFilter} onValueChange={(value) => onComplianceChange(value as ComplianceValue)}>
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Compliance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          <SelectItem value="low">Low risk</SelectItem>
          <SelectItem value="medium">Monitor</SelectItem>
          <SelectItem value="high">High risk</SelectItem>
        </SelectContent>
      </Select>
      </Flex>
    </Stack>
  )
}
