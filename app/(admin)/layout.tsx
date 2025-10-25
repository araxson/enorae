import { cookies } from 'next/headers'
import { SidebarInset, SidebarProvider, SIDEBAR_COOKIE_NAME } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/features/shared/portal-shell/components/sidebars/admin-sidebar'
import { PortalHeader } from '@/features/shared/portal-shell/components/portal-header'
import { AdminKeyboardShortcuts } from '@/features/admin/admin-common/components/admin-keyboard-shortcuts'

export const runtime = 'nodejs'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== 'false'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset>
        <PortalHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AdminKeyboardShortcuts />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
