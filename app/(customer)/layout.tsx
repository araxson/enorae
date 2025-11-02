import { cookies } from 'next/headers'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { CustomerSidebar } from '@/features/shared/portal-shell/components/sidebars/customer-sidebar'
import { PortalHeader } from '@/features/shared/portal-shell/components/portal-header'

export const runtime = 'nodejs'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <CustomerSidebar />
      <SidebarInset>
        <PortalHeader />
        <main id="main-content" className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
