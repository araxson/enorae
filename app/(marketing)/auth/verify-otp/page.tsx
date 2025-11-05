import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { VerifyOtpPage, verifyOtpPageMetadata } from '@/features/auth'

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
