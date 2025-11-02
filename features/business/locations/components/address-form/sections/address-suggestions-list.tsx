'use client'

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'

interface AddressSuggestion {
  description: string
  place_id: string
}

interface AddressSuggestionsListProps {
  suggestions: AddressSuggestion[]
  suggestionListId: string
  onSuggestionClick: (placeId: string, description: string) => void
}

export function AddressSuggestionsList({
  suggestions,
  suggestionListId,
  onSuggestionClick,
}: AddressSuggestionsListProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="absolute left-0 right-0 top-full z-10 mt-1">
      <Command aria-label="Address suggestions">
        <CommandList id={suggestionListId}>
          <CommandGroup heading="Suggested addresses">
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion.place_id}
                value={suggestion.place_id}
                onSelect={() =>
                  onSuggestionClick(
                    suggestion.place_id,
                    suggestion['description'],
                  )
                }
              >
                {suggestion['description']}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
