'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack, Group, Box } from '@/components/layout'
import { Search, SlidersHorizontal } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

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
        <CardTitle className="text-lg">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group gap="sm" className="flex-1">
              <Input
                placeholder="Search salons..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Group>

            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Box pt="md">
                  <Stack gap="md">
                    <Stack gap="sm">
                      <Label>
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        min={0}
                        max={500}
                        step={10}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </CollapsibleContent>
            </Collapsible>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
