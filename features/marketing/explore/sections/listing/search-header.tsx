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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
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
        <Item
          className="flex-col items-center text-center sm:items-start sm:text-left"
          variant="muted"
        >
          <ItemHeader>
            <Badge variant="outline">
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              {listingCopy.badge}
            </Badge>
          </ItemHeader>
          <ItemContent>
            <ItemTitle>{listingCopy.title}</ItemTitle>
            <ItemDescription>{listingCopy.description}</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <div className="flex flex-col gap-3 sm:flex-row">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={listingCopy.searchPlaceholder}
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
        <Button type="button" className="gap-2" onClick={onSearch}>
          <Search className="h-4 w-4" aria-hidden="true" />
          {listingCopy.searchButton}
        </Button>
      </div>
      <Item
        className="w-full flex-col items-center text-center sm:w-auto sm:items-start sm:text-left"
        variant="muted"
      >
        <ItemContent>
          <ItemDescription>
            Press <Kbd>Enter</Kbd> to search instantly or refine your filters first.
          </ItemDescription>
        </ItemContent>
      </Item>
    </header>
  )
}
