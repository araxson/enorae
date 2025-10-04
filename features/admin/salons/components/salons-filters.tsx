'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { Flex } from '@/components/layout'

type SalonsFiltersProps = {
  onSearchChange: (search: string) => void
  onTierChange: (tier: string) => void
}

export function SalonsFilters({ onSearchChange, onTierChange }: SalonsFiltersProps) {
  const [search, setSearch] = useState('')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  return (
    <Flex gap="md" className="flex-col sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search salons by name, business name, or slug..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select onValueChange={onTierChange} defaultValue="all">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    </Flex>
  )
}
