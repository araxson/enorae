import { BasePortalLayout } from '@/components/layout/layouts/base-portal-layout'
import { AdminKeyboardShortcuts } from '@/features/admin/admin-common/components/admin-keyboard-shortcuts'

export const runtime = 'nodejs'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BasePortalLayout portal="admin" title="Admin Portal" subtitle="Platform v1.0">
      <AdminKeyboardShortcuts />
      {children}
    </BasePortalLayout>
  )
}
