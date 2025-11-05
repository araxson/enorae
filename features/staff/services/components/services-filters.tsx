'use client'

import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

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
        <InputGroup className="flex-1 min-w-56">
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search services"
            autoComplete="off"
          />
        </InputGroup>
      ) : null}

      <Field className="w-44">
        <FieldLabel htmlFor="services-category-filter">Category</FieldLabel>
        <FieldContent>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger id="services-category-filter">
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
        </FieldContent>
      </Field>

      <Field className="w-40">
        <FieldLabel htmlFor="services-proficiency-filter">Proficiency</FieldLabel>
        <FieldContent>
          <Select value={proficiencyFilter} onValueChange={onProficiencyFilterChange}>
            <SelectTrigger id="services-proficiency-filter">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </div>
  )
}
