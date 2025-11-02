'use client'

import { Dispatch, SetStateAction } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

interface SearchSuggestionsPopoverProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  suggestions: Array<{ slug: string; name: string }>
  onSelect: (slug: string) => void
  children: React.ReactNode
}

export function SearchSuggestionsPopover({
  open,
  setOpen,
  suggestions,
  onSelect,
  children,
}: SearchSuggestionsPopoverProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No matches found.</CommandEmpty>
            <CommandGroup heading="Salons">
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.slug}
                  value={suggestion.name}
                  onSelect={() => onSelect(suggestion.slug)}
                >
                  {suggestion.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
