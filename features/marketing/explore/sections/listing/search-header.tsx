'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item'
import { Search, Sparkles, X } from 'lucide-react'
import { listingCopy } from './listing.data'

interface SearchHeaderProps {
  query: string
  onQueryChange: (query: string) => void
  onSearch: () => void
}

export function SearchHeader({ query, onQueryChange, onSearch }: SearchHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <ItemGroup className="gap-4">
        <Item variant="muted">
          <ItemHeader>
            <div className="flex w-full justify-center sm:justify-start">
              <Badge variant="outline">
                <Sparkles className="mr-2 size-4" aria-hidden="true" />
                {listingCopy.badge}
              </Badge>
            </div>
          </ItemHeader>
          <ItemContent>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <ItemTitle>{listingCopy.title}</ItemTitle>
              <ItemDescription>{listingCopy.description}</ItemDescription>
            </div>
          </ItemContent>
        </Item>
      </ItemGroup>
      <div className="flex flex-col gap-3 sm:flex-row">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={listingCopy.searchPlaceholder}
            aria-label="Search listings"
            autoComplete="off"
          />
          {query ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                variant="ghost"
                onClick={() => onQueryChange('')}
                aria-label="Clear search"
              >
                <X className="size-4" aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
        <Button type="button" onClick={onSearch}>
          <Search className="mr-2 size-4" aria-hidden="true" />
          {listingCopy.searchButton}
        </Button>
      </div>
      <Item variant="muted">
        <ItemContent>
          <div className="flex w-full flex-col items-center text-center sm:items-start sm:text-left">
            <ItemDescription>
              Press <Kbd>Enter</Kbd> to search instantly or refine your filters first.
            </ItemDescription>
          </div>
        </ItemContent>
      </Item>
    </header>
  )
}
