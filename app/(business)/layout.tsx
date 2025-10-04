import { cookies } from 'next/headers'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { PortalSidebar } from '@/components/layout/portal-sidebar'
import { DynamicBreadcrumbs, NavActions } from '@/components/layout'
import { BUSINESS_SIDEBAR_SECTIONS } from '@/lib/constants/sidebar-menus'

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PortalSidebar
        title="Business Portal"
        sections={BUSINESS_SIDEBAR_SECTIONS}
        version="Business v1.0"
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumbs />
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 px-4 py-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
