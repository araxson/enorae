import { Suspense } from 'react'
import { SalonProfilePage, generateSalonProfileMetadata } from '@/features/marketing/salon-directory'
import { PageLoading } from '@/features/shared/ui-components'

export { generateSalonProfileMetadata as generateMetadata }

type PageProps = Parameters<typeof SalonProfilePage>[0]

export default async function SalonDetailPage(props: PageProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <SalonProfilePage {...props} />
    </Suspense>
  )
}
