'use client'

import { useState, memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SalonCard } from '@/features/shared/salons'
import { FavoriteButton } from '@/features/customer/favorites/components/favorite-button'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { Database } from '@/lib/types/database.types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type Salon = Database['public']['Views']['salons_view']['Row']

interface SalonGridProps {
  salons: Salon[]
  itemsPerPage?: number
}

export const SalonGrid = memo(function SalonGrid({ salons, itemsPerPage = 9 }: SalonGridProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(salons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSalons = salons.slice(startIndex, endIndex)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // PERFORMANCE FIX: Memoize navigation handler to prevent recreating on every render
  const handleNavigate = useCallback((slug: string | null) => {
    if (slug) {
      router.push(`/salons/${slug}`)
    }
  }, [router])

  if (salons.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Search className="size-10" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No salons found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search filters or check back later for new salons.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          Tip: update your filters or expand your search area.
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-8">
      <ItemGroup>
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <Search className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Salon results</ItemTitle>
            <ItemDescription>
              Showing {currentSalons.length} of {salons.length} salons
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {currentSalons.map((salon) => {
          // Build proper location string from address data
          const location = salon['formatted_address'] ||
            (salon['city'] && salon['state_province'] ? `${salon['city']}, ${salon['state_province']}` : null) ||
            'Location not specified'

          // Use real ratings from database
          const rating = salon['rating_average'] ? Number(salon['rating_average']) : undefined
          const reviewCount = salon['rating_count'] || 0

          // Use short description, fallback to full description
          const description = salon['short_description'] || salon['full_description'] || undefined
          const initialFavorited = Boolean(
            (salon as { is_favorited?: boolean }).is_favorited,
          )

          return (
            <SalonCard
              key={salon['id'] || ''}
              salonId={salon['id'] || undefined}
              name={salon['name'] || 'Unnamed Salon'}
              description={description}
              image={undefined}
              location={location}
              rating={rating}
              reviewCount={reviewCount}
              isAcceptingBookings={salon['is_accepting_bookings'] ?? true}
              onBook={() => handleNavigate(salon['slug'])}
              onViewDetails={() => handleNavigate(salon['slug'])}
              favoriteAction={
                salon['id'] ? (
                  <FavoriteButton
                    salonId={salon['id']}
                    initialFavorited={initialFavorited}
                    variant="icon"
                  />
                ) : null
              }
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={
                  currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
})
