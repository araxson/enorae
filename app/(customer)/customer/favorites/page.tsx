import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { Favorites } from '@/features/customer/favorites'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'My Favorites',
  description: 'View and manage your favorite salons',
  noIndex: true,
})

export default function FavoritesPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Favorites />
    </Suspense>
  )
}
