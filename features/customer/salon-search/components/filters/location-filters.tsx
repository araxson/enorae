'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

interface LocationFiltersProps {
  city: string
  setCity: (value: string) => void
  state: string
  setState: (value: string) => void
  popularCities: { city: string; count: number }[]
  availableStates: string[]
}

export function LocationFilters({
  city,
  setCity,
  state,
  setState,
  popularCities,
  availableStates,
}: LocationFiltersProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="city-filter">City</FieldLabel>
        <FieldContent>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id="city-filter">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All cities</SelectItem>
              {popularCities.map((c) => (
                <SelectItem key={c.city} value={c.city}>
                  {c.city} ({c.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="state-filter">State</FieldLabel>
        <FieldContent>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger id="state-filter">
              <SelectValue placeholder="All states" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All states</SelectItem>
              {availableStates.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </>
  )
}
