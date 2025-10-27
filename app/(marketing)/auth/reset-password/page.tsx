import { Suspense } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { ResetPasswordPage as ResetPasswordFeature, resetPasswordPageMetadata } from '@/features/shared/auth'

export const metadata = resetPasswordPageMetadata

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordFeature />
    </Suspense>
  )
}
