import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { ForgotPasswordPage as ForgotPasswordFeature, forgotPasswordPageMetadata } from '@/features/auth'

export const metadata = forgotPasswordPageMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <ForgotPasswordFeature />
    </Suspense>
  )
}
