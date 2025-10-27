'use client'

import { useEffect } from 'react'
import { Search, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
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
    'admin:clearFilters': CustomEvent<void>
  }
}

type ModerationFiltersProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  riskFilter: string
  onRiskFilterChange: (risk: string) => void
  sentimentFilter: string
  onSentimentFilterChange: (sentiment: string) => void
  reputationFilter: string
  onReputationFilterChange: (reputation: string) => void
}

export function ModerationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  riskFilter,
  onRiskFilterChange,
  sentimentFilter,
  onSentimentFilterChange,
  reputationFilter,
  onReputationFilterChange,
}: ModerationFiltersProps) {
  const clearFilters = () => {
    onSearchChange('')
    onStatusFilterChange('all')
    onRiskFilterChange('all')
    onSentimentFilterChange('all')
    onReputationFilterChange('all')
  }

  useEffect(() => {
    const handleClear = () => clearFilters()
    window.addEventListener('admin:clearFilters', handleClear)
    return () => window.removeEventListener('admin:clearFilters', handleClear)
  }, [
    onSearchChange,
    onStatusFilterChange,
    onRiskFilterChange,
    onSentimentFilterChange,
    onReputationFilterChange,
  ])

  return (
    <div className="flex flex-col gap-3">
      <ItemGroup className="justify-end">
        <Item variant="muted">
          <ItemActions>
            <ButtonGroup>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            </ButtonGroup>
          </ItemActions>
        </Item>
      </ItemGroup>
      <FieldGroup className="flex flex-wrap items-center gap-3">
        <Field className="min-w-56 flex-1">
          <FieldLabel htmlFor="moderation-search">Search</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="moderation-search"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <InputGroupAddon align="inline-end">
                {searchQuery ? (
                  <InputGroupButton
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Clear search"
                    onClick={() => onSearchChange('')}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </InputGroupButton>
                ) : null}
              </InputGroupAddon>
            </InputGroup>
          </FieldContent>
        </Field>

        <Field className="min-w-48">
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All reviews</SelectItem>
                <SelectItem value="flagged">Flagged only</SelectItem>
                <SelectItem value="unflagged">Not flagged</SelectItem>
                <SelectItem value="pending">Pending response</SelectItem>
                <SelectItem value="responded">Has response</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field className="min-w-40">
          <FieldLabel>Risk level</FieldLabel>
          <FieldContent>
            <Select value={riskFilter} onValueChange={onRiskFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All risk levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All risk levels</SelectItem>
                <SelectItem value="high">High risk</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field className="min-w-40">
          <FieldLabel>Sentiment</FieldLabel>
          <FieldContent>
            <Select value={sentimentFilter} onValueChange={onSentimentFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All sentiments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field className="min-w-44">
          <FieldLabel>Reviewer reputation</FieldLabel>
          <FieldContent>
            <Select value={reputationFilter} onValueChange={onReputationFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All reputation tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All reputation tiers</SelectItem>
                <SelectItem value="trusted">Trusted</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="risky">Risky</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  )
}
