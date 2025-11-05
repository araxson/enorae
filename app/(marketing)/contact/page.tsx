import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { ContactPage, contactMetadata } from '@/features/marketing/contact'

export const metadata = contactMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <ContactPage />
    </Suspense>
  )
}
