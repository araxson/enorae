import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { AboutPage, aboutSEO } from '@/features/marketing/about'

export const metadata = aboutSEO

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <AboutPage />
    </Suspense>
  )
}
