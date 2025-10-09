import { ForgotPasswordPage as ForgotPasswordFeature, forgotPasswordPageMetadata } from '@/features/shared/auth'

export const metadata = forgotPasswordPageMetadata

export default function Page() {
  return <ForgotPasswordFeature />
}
