'use client'

import { useState, useMemo } from 'react'
import { ReviewsList } from './reviews-list'
import { SearchBar } from '@/features/admin/common/components'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Database } from '@/lib/types/database.types'

type AdminReview = Database['public']['Views']['admin_reviews_overview_view']['Row']

interface ReviewsClientProps {
  reviews: AdminReview[]
}

export function ReviewsClient({ reviews }: ReviewsClientProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'flagged' | 'unverified' | 'needs_response'>('all')

  const filteredReviews = useMemo(() => {
    let filtered = reviews

    // Apply filter
    if (filter === 'flagged') {
      filtered = filtered.filter(r => r['is_flagged'])
    } else if (filter === 'unverified') {
      filtered = filtered.filter(r => !r['is_verified'])
    } else if (filter === 'needs_response') {
      filtered = filtered.filter(r => !r['has_response'])
    }

    // Apply search
    if (search) {
      const query = search.toLowerCase()
      filtered = filtered.filter(r =>
        r['salon_name']?.toLowerCase().includes(query) ||
        r['customer_name']?.toLowerCase().includes(query) ||
        r['comment']?.toLowerCase().includes(query) ||
        r['title']?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [reviews, search, filter])

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        placeholder="Search reviews by salon, customer, or content..."
        onSearch={setSearch}
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged ({reviews.filter(r => r['is_flagged']).length})
          </TabsTrigger>
          <TabsTrigger value="unverified">
            Unverified ({reviews.filter(r => !r['is_verified']).length})
          </TabsTrigger>
          <TabsTrigger value="needs_response">
            Needs Response ({reviews.filter(r => !r['has_response']).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <ReviewsList reviews={filteredReviews} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
