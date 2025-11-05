'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/lib/hooks'
import { SalonGrid } from './salon-grid'
import { SearchFilters } from './search-filters'
import type { Database } from '@/lib/types/database.types'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

type Salon = Database['public']['Views']['salons_view']['Row']

interface SalonDiscoveryClientProps {
  initialSalons: Salon[]
}

export function SalonDiscoveryClient({ initialSalons }: SalonDiscoveryClientProps) {
  const [salons, setSalons] = useState(initialSalons)
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false)
  const isMobile = useIsMobile()

  function handleResponsiveSearch(query: string, priceRange?: [number, number]) {
    let filtered = initialSalons

    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (salon) =>
          salon['name']?.toLowerCase().includes(lowerQuery) ||
          salon['short_description']?.toLowerCase().includes(lowerQuery) ||
          salon['full_description']?.toLowerCase().includes(lowerQuery)
      )
    }

    if (priceRange) {
      filtered = filtered.filter((salon) => {
        const price =
          typeof salon['average_price'] === 'number'
            ? salon['average_price']
            : typeof salon['starting_price'] === 'number'
              ? salon['starting_price']
              : undefined

        if (typeof price !== 'number') {
          return true
        }

        return price >= priceRange[0] && price <= priceRange[1]
      })
    }

    setSalons(filtered)
    if (isMobile) {
      setFilterSheetOpen(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {isMobile ? (
        <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="space-y-6">
            <SheetHeader>
              <SheetTitle>Refine salons</SheetTitle>
            </SheetHeader>
            <SearchFilters
              onSearch={handleResponsiveSearch}
              onAfterSearch={() => setFilterSheetOpen(false)}
            />
            <SheetFooter>
              <ButtonGroup orientation="vertical" className="w-full">
                <SheetClose asChild>
                  <Button type="button">
                    Apply filters
                  </Button>
                </SheetClose>
              </ButtonGroup>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <SearchFilters onSearch={handleResponsiveSearch} />
      )}

      <ItemGroup>
        <Item variant="muted" size="sm">
          <ItemContent>
            <ItemTitle>Results</ItemTitle>
            <ItemDescription>
              {salons.length}{' '}
              {salons.length === 1 ? 'salon found' : 'salons found'}
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <SalonGrid salons={salons} />
    </div>
  )
}
