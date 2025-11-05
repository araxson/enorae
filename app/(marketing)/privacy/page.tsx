import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { PrivacyPage, privacyMetadata } from '@/features/marketing/privacy'

export const metadata = privacyMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <PrivacyPage />
    </Suspense>
  )
}
