'use client'

import { useId } from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import type { LocationAddress } from '@/features/business/locations/types'
import { useAddressSearch } from '@/features/business/locations/hooks/use-address-search'
import { AddressSearchInput } from './address-search-input'
import { AddressSuggestionsList } from './address-suggestions-list'

type AddressSearchFieldProps = {
  address: LocationAddress | null
  onAddressSelect?: (address: Partial<LocationAddress>) => void
}

export function AddressSearchField({ address, onAddressSelect }: AddressSearchFieldProps) {
  const suggestionListId = useId()
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    suggestions,
    setSuggestions,
    geocodeAddress,
  } = useAddressSearch(onAddressSelect)

  const handleSuggestionClick = async (placeId: string, description: string) => {
    setSuggestions([])
    setSearchQuery(description)
    await geocodeAddress(description)
  }

  const handleManualGeocode = () => {
    if (address) {
      const fullAddress = `${address['street_address']}, ${address['city']}, ${address['state_province']} ${address['postal_code']}, ${address['country_code']}`
      geocodeAddress(fullAddress)
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor="address-search">Search Address</FieldLabel>
      <FieldContent>
        <div className="relative">
          <AddressSearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearching={isSearching}
            suggestionListId={suggestionListId}
            suggestionsLength={suggestions.length}
            address={address}
            onManualGeocode={handleManualGeocode}
          />
          <AddressSuggestionsList
            suggestions={suggestions}
            suggestionListId={suggestionListId}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </FieldContent>
      <FieldDescription>Search for your address to automatically fill coordinates.</FieldDescription>
    </Field>
  )
}
