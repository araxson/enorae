'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ServicesFiltersProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  categoryFilter: string
  onCategoryFilterChange: (category: string) => void
  proficiencyFilter: string
  onProficiencyFilterChange: (proficiency: string) => void
  categories: string[]
  showSearch?: boolean
}

export function ServicesFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  proficiencyFilter,
  onProficiencyFilterChange,
  categories,
  showSearch = true,
}: ServicesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {showSearch ? (
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9"
          />
        </div>
      ) : null}

      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={proficiencyFilter} onValueChange={onProficiencyFilterChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All levels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
