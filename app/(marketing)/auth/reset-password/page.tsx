import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui-components'
import { ResetPasswordPage as ResetPasswordFeature, resetPasswordPageMetadata } from '@/features/auth'

export const metadata = resetPasswordPageMetadata

export default function Page() {
  return (
    <Suspense
      fallback={<PageLoading />}
    >
      <ResetPasswordFeature />
    </Suspense>
  )
}
