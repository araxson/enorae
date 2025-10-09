import { ResetPasswordPage as ResetPasswordFeature, resetPasswordPageMetadata } from '@/features/shared/auth'

export const metadata = resetPasswordPageMetadata

export default function Page() {
  return <ResetPasswordFeature />
}
