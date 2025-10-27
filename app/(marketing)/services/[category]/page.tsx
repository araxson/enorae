import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import {
  ServicesCategoryPage,
  generateServicesCategoryMetadata,
} from '@/features/marketing/services-directory'

export { generateServicesCategoryMetadata as generateMetadata }

type PageProps = Parameters<typeof ServicesCategoryPage>[0]

export default async function ServiceCategoryPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <ServicesCategoryPage {...props} />
    </Suspense>
  )
}
