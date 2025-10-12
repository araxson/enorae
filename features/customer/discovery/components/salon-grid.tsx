'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SalonCard } from '@/features/shared/salons'
import { FavoriteButton } from '@/features/customer/favorites/components/favorite-button'
import { Card, CardContent } from '@/components/ui/card'
import { H3, Muted } from '@/components/ui/typography'
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

type Salon = Database['public']['Views']['salons']['Row']

interface SalonGridProps {
  salons: Salon[]
  itemsPerPage?: number
}

export function SalonGrid({ salons, itemsPerPage = 9 }: SalonGridProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(salons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSalons = salons.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (salons.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-3 py-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <H3>No salons found</H3>
            <Muted>
              Try adjusting your search filters or check back later for new salons.
            </Muted>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {currentSalons.map((salon) => {
          // Build proper location string from address data
          const location = salon.full_address ||
            (salon.city && salon.state_province ? `${salon.city}, ${salon.state_province}` : null) ||
            'Location not specified'

          // Use real ratings from database
          const rating = salon.rating ? Number(salon.rating) : undefined
          const reviewCount = salon.review_count || 0

          // Use logo or cover image if available
          const image = salon.logo_url || salon.cover_image_url || undefined

          // Use short description, fallback to full description
          const description = salon.short_description || salon.description || undefined
          const initialFavorited = Boolean(
            (salon as { is_favorited?: boolean }).is_favorited,
          )

          return (
            <SalonCard
              key={salon.id || ''}
              salonId={salon.id || undefined}
              name={salon.name || 'Unnamed Salon'}
              description={description}
              image={image}
              location={location}
              rating={rating}
              reviewCount={reviewCount}
              isAcceptingBookings={salon.is_accepting_bookings ?? true}
              amenities={salon.amenities}
              specialties={salon.specialties}
              staffCount={salon.staff_count}
              servicesCount={salon.services_count}
              onBook={() => {
                router.push(`/salons/${salon.slug}`)
              }}
              onViewDetails={() => {
                router.push(`/salons/${salon.slug}`)
              }}
              favoriteAction={
                salon.id ? (
                  <FavoriteButton
                    salonId={salon.id}
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
}
