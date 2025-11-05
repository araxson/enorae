'use client'

import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemGroup } from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'
import { FieldGroup } from '@/components/ui/field'
import { SearchFilter, GenericFilter } from '@/features/shared/ui/components/filters'

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
  onClearFilters: () => void
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
  onClearFilters,
}: ModerationFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <ItemGroup className="justify-end">
        <Item variant="muted">
          <ItemActions>
            <ButtonGroup>
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear all filters
              </Button>
            </ButtonGroup>
          </ItemActions>
        </Item>
      </ItemGroup>
      <FieldGroup className="flex flex-wrap items-center gap-3">
        <SearchFilter
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search reviews..."
          label="Search"
          inputId="moderation-search"
          className="min-w-56 flex-1"
        />

        <GenericFilter
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={[
            { label: 'Flagged only', value: 'flagged' },
            { label: 'Not flagged', value: 'unflagged' },
            { label: 'Pending response', value: 'pending' },
            { label: 'Has response', value: 'responded' },
            { label: 'Featured', value: 'featured' },
          ]}
          label="Status"
          placeholder="All reviews"
          showAll={true}
          allLabel="All reviews"
          className="min-w-48"
        />

        <GenericFilter
          value={riskFilter}
          onChange={onRiskFilterChange}
          options={[
            { label: 'High risk', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ]}
          label="Risk level"
          placeholder="All risk levels"
          showAll={true}
          allLabel="All risk levels"
          className="min-w-40"
        />

        <GenericFilter
          value={sentimentFilter}
          onChange={onSentimentFilterChange}
          options={[
            { label: 'Positive', value: 'positive' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Negative', value: 'negative' },
          ]}
          label="Sentiment"
          placeholder="All sentiments"
          showAll={true}
          allLabel="All sentiments"
          className="min-w-40"
        />

        <GenericFilter
          value={reputationFilter}
          onChange={onReputationFilterChange}
          options={[
            { label: 'Trusted', value: 'trusted' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Risky', value: 'risky' },
          ]}
          label="Reviewer reputation"
          placeholder="All reputation tiers"
          showAll={true}
          allLabel="All reputation tiers"
          className="min-w-44"
        />
      </FieldGroup>
    </div>
  )
}
