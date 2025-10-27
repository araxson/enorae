import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import {
  SalonProfilePage,
  generateSalonProfileMetadata,
} from '@/features/marketing/salon-directory'

export { generateSalonProfileMetadata as generateMetadata }

type PageProps = Parameters<typeof SalonProfilePage>[0]

export default async function SalonDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <SalonProfilePage {...props} />
    </Suspense>
  )
}
