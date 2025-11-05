import { cookies } from 'next/headers'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { BusinessSidebar, PortalHeader } from '@/features/shared/portal-shell/components'

export const runtime = 'nodejs'

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <SidebarProvider defaultOpen={defaultOpen}>
        <BusinessSidebar />
        <SidebarInset>
          <PortalHeader />
          <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
