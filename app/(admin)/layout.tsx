import { cookies } from 'next/headers'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
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
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset>
        <PortalHeader />
        <main id="main-content" className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AdminKeyboardShortcuts />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
