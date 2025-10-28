'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, SlidersHorizontal } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface SearchFiltersProps {
  onSearch: (query: string, priceRange?: [number, number]) => void
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [query, setQuery] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(query, priceRange)
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Search className="size-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Search &amp; filter</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldSet>
            <FieldLegend className="sr-only">Search salons</FieldLegend>
            <Field>
              <FieldLabel htmlFor="salon-search" className="sr-only">
                Search salons
              </FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="salon-search"
                    type="search"
                    placeholder="Search salons..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search salons"
                    autoComplete="off"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton type="submit" className="gap-2" aria-label="Submit search">
                      <Search className="size-4" aria-hidden="true" />
                      Search
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>
            </Field>
          </FieldSet>

          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <SlidersHorizontal className="size-4" />
                {isFiltersOpen ? 'Hide filters' : 'Show filters'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <Field>
                <FieldLabel>Price range</FieldLabel>
                <FieldContent className="space-y-2">
                  <FieldDescription>
                    ${priceRange[0]} - ${priceRange[1]}
                  </FieldDescription>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={0}
                    max={500}
                    step={10}
                  />
                </FieldContent>
              </Field>
            </CollapsibleContent>
          </Collapsible>
        </form>
      </CardContent>
    </Card>
  )
}
