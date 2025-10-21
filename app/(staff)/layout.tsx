import { BasePortalLayout } from '@/features/shared/portal-shell'

export const runtime = 'nodejs'

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BasePortalLayout portal="staff" title="Staff Portal">
      {children}
    </BasePortalLayout>
  )
}
