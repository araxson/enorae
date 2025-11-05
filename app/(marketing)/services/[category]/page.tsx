import { Suspense } from 'react'
import { ServicesCategoryPage, generateServicesCategoryMetadata } from '@/features/marketing/services-directory'
import { PageLoading } from '@/features/shared/ui'

export { generateServicesCategoryMetadata as generateMetadata }

type PageProps = Parameters<typeof ServicesCategoryPage>[0]

export default async function ServiceCategoryPage(props: PageProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <ServicesCategoryPage {...props} />
    </Suspense>
  )
}
