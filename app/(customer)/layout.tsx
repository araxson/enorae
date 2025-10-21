import { BasePortalLayout } from '@/features/shared/portal-shell'

export const runtime = 'nodejs'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BasePortalLayout portal="customer" title="Customer Portal">
      {children}
    </BasePortalLayout>
  )
}
