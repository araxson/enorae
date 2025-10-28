import { cookies } from 'next/headers'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { BusinessSidebar } from '@/features/shared/portal-shell/components/sidebars/business-sidebar'
import { PortalHeader } from '@/features/shared/portal-shell/components/portal-header'

export const runtime = 'nodejs'

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <BusinessSidebar />
      <SidebarInset>
        <PortalHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
