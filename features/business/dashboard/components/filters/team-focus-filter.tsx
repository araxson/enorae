'use client'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

const STYLIST_OPTIONS = ['Any stylist', 'Color specialists', 'Front desk', 'Senior stylists']

type TeamFocusFilterProps = {
  selectedStylist: string | undefined
  onSelect: (stylist: string) => void
}

export function TeamFocusFilter({ selectedStylist, onSelect }: TeamFocusFilterProps) {
  return (
    <Field>
      <FieldLabel>Team focus</FieldLabel>
      <FieldContent>
        <Command>
          <CommandInput placeholder="Filter by team group" />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup heading="Groups">
              {STYLIST_OPTIONS.map((option) => (
                <CommandItem key={option} onSelect={() => onSelect(option)}>
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => onSelect('Any stylist')}>Reset selection</CommandItem>
              <CommandItem onSelect={() => onSelect('Senior stylists')}>Focus on senior stylists</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </FieldContent>
    </Field>
  )
}
