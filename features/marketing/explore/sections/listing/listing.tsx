'use client'

import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/types/database.types'
import { MarketingSection } from '@/features/marketing/components/common'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { SearchHeader } from './search-header'
import { EmptyState } from './empty-state'
import { SalonCard } from './salon-card'
import { listingCopy, listingFilters } from './listing.data'

type Salon = Database['public']['Views']['salons_view']['Row']

export interface ExploreListingProps {
  salons: Salon[]
}

const PAGE_SIZE = 6
const RECENT_DAYS = 90

export function ExploreListing({ salons }: ExploreListingProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<(typeof listingFilters)[number]['value']>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const trimmedQuery = query.trim()
    const delay = trimmedQuery ? 250 : 0
    const timer = window.setTimeout(() => {
      setDebouncedQuery(trimmedQuery)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [query])

  const filteredBySearch = useMemo(() => {
    const normalizedQuery = debouncedQuery.toLowerCase()
    if (!normalizedQuery) return salons

    return salons.filter((salon) => {
      const haystack = [
        salon['name'],
        salon['city'],
        salon['state_province'],
        salon['short_description'],
        salon['full_description'],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [debouncedQuery, salons])

  const filteredSalons = useMemo(() => {
    if (activeFilter === 'top-rated') {
      return filteredBySearch.filter((salon) => {
        const ratingValue =
          typeof salon['rating_average'] === 'number'
            ? salon['rating_average']
            : Number(salon['rating_average'] ?? 0)
        return ratingValue >= 4.5
      })
    }

    if (activeFilter === 'new') {
      const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000
      return filteredBySearch.filter((salon) => {
        const createdAt = salon['created_at'] ? new Date(salon['created_at']).getTime() : null
        return createdAt !== null && createdAt >= cutoff
      })
    }

    return filteredBySearch
  }, [activeFilter, filteredBySearch])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, activeFilter])

  const totalResults = filteredSalons.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedSalons = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredSalons.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredSalons])

  const showSkeleton = query.trim() !== debouncedQuery

  function handleBook(slug?: string | null) {
    if (!slug) {
      router.push('/signup')
      return
    }

    router.push(`/signup?redirect=/customer/salons/${slug}`)
  }

  function handleSearchSubmit() {
    const trimmedQuery = query.trim()
    setQuery(trimmedQuery)
    setDebouncedQuery(trimmedQuery)
  }

  function handleReset() {
    setQuery('')
    setDebouncedQuery('')
    setActiveFilter('all')
    setCurrentPage(1)
  }

  function handlePageClick(event: MouseEvent<HTMLAnchorElement>, page: number) {
    event.preventDefault()
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
  }

  function handlePrevious(event: MouseEvent<HTMLAnchorElement>) {
    handlePageClick(event, currentPage - 1)
  }

  function handleNext(event: MouseEvent<HTMLAnchorElement>) {
    handlePageClick(event, currentPage + 1)
  }

  const activeFilterDescription = listingFilters.find(
    (filter) => filter.value === activeFilter,
  )?.description

  return (
    <MarketingSection className="pb-16 pt-6" spacing="none" groupClassName="gap-8">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearchSubmit}
      />

      <ToggleGroup
        type="single"
        value={activeFilter}
        onValueChange={(value) => {
          if (value) {
            setActiveFilter(value as typeof activeFilter)
          }
        }}
        aria-label={listingCopy.filtersLabel}
        className="flex-wrap justify-center gap-2 sm:justify-start"
      >
        {listingFilters.map((filter) => (
          <ToggleGroupItem key={filter.value} value={filter.value}>
            {filter.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {activeFilterDescription ? (
        <p className="text-sm text-muted-foreground">{activeFilterDescription}</p>
      ) : null}

      <Separator />

      {totalResults > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {listingCopy.resultsSummary(paginatedSalons.length, totalResults)}
          </p>
          {showSkeleton ? <Spinner /> : null}
        </div>
      ) : null}

      {showSkeleton ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Card key={`salon-skeleton-${index}`}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-end">
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : totalResults === 0 ? (
        <EmptyState onReset={handleReset} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedSalons.map((salon, index) => (
            <SalonCard
              key={salon.id ?? salon.slug ?? `salon-${index}`}
              salon={salon}
              onBook={handleBook}
            />
          ))}
        </div>
      )}

      {!showSkeleton && totalResults > PAGE_SIZE ? (
        <Pagination className="pt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePrevious}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === currentPage}
                    onClick={(event) => handlePageClick(event, pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNext}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </MarketingSection>
  )
}
