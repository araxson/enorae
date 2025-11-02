import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { VerifyOtpPage, verifyOtpPageMetadata } from '@/features/shared/auth'

export const metadata = verifyOtpPageMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <VerifyOtpPage />
    </Suspense>
  )
}
