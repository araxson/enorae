'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EXTERNAL_APIS } from '@/lib/config/env'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import type { LocationAddress } from '@/features/business/locations/api/types'

interface AddressSearchInputProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearching: boolean
  suggestionListId?: string
  suggestionsLength: number
  address: LocationAddress | null
  onManualGeocode: () => void
}

export function AddressSearchInput({
  searchQuery,
  setSearchQuery,
  isSearching,
  suggestionListId,
  suggestionsLength,
  address,
  onManualGeocode,
}: AddressSearchInputProps) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="address-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Start typing to search for an address..."
            aria-autocomplete="list"
            aria-controls={suggestionsLength > 0 ? suggestionListId : undefined}
            aria-expanded={suggestionsLength > 0}
            autoComplete="off"
          />
        </InputGroup>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onManualGeocode}
        disabled={isSearching || !address?.['street_address'] || !EXTERNAL_APIS.GOOGLE_MAPS.isEnabled()}
      >
        <Search className="mr-2 size-4" />
        Geocode
      </Button>
    </div>
  )
}
