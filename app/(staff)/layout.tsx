import { cookies } from 'next/headers'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { PortalSidebar } from '@/components/layout/portal-sidebar'
import { DynamicBreadcrumbs } from '@/components/layout'
import { STAFF_SIDEBAR_SECTIONS } from '@/lib/constants/sidebar-menus'

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PortalSidebar
        title="Staff Portal"
        sections={STAFF_SIDEBAR_SECTIONS}
        version="Staff v1.0"
      />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumbs />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
