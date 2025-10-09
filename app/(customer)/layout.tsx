import { BasePortalLayout } from '@/components/layout/layouts/base-portal-layout'

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
