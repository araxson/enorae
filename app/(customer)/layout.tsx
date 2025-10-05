import { cookies } from 'next/headers'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { PortalSidebar } from '@/components/layout/portal-sidebar'
import { DynamicBreadcrumbs } from '@/components/layout'
import { UserNav } from '@/components/layout/user-nav'
import { CUSTOMER_SIDEBAR_SECTIONS } from '@/lib/constants/sidebar-menus'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PortalSidebar
        title="Customer Portal"
        sections={CUSTOMER_SIDEBAR_SECTIONS}
        version="Customer v1.0"
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumbs />
          </div>
          <div className="ml-auto">
            <UserNav portal="customer" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
