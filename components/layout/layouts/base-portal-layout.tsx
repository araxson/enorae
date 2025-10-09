import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import {
  SidebarProvider,
  SidebarInset,
  SIDEBAR_COOKIE_NAME,
  isSidebarOpenFromCookie,
} from '@/components/ui/sidebar'
import { PortalSidebarWrapper } from '../sidebars/portal-sidebar-wrapper'
import { PortalHeader } from '../headers/portal-header'
import { BusinessSalonSwitcher } from '@/features/business/shared/components/salon-switcher'
import { verifySession } from '@/lib/auth/session'
import { DEFAULT_ROUTES, ROLE_HIERARCHY } from '@/lib/auth/permissions/roles'

interface BasePortalLayoutProps {
  portal: 'customer' | 'business' | 'staff' | 'admin'
  title: string
  subtitle?: string
  children: React.ReactNode
}

export async function BasePortalLayout({
  portal,
  title,
  subtitle,
  children,
}: BasePortalLayoutProps) {
  const portalPath = `/${portal}`
  const session = await verifySession()

  if (!session) {
    redirect(`/login?redirect=${portalPath}`)
  }

  const allowedRoutes = ROLE_HIERARCHY[session.role] ?? []
  const hasPortalAccess = allowedRoutes.some((allowedRoute) => portalPath.startsWith(allowedRoute))

  if (!hasPortalAccess) {
    const fallbackRoute = DEFAULT_ROUTES[session.role] ?? '/'
    redirect(fallbackRoute)
  }

  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value
  const defaultOpen = isSidebarOpenFromCookie(cookieValue)

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="flex min-h-screen">
      <PortalSidebarWrapper
        portal={portal}
        title={title}
        subtitle={subtitle}
        session={session}
      />
      <SidebarInset className="flex flex-1 flex-col">
        <PortalHeader />
        <main className="flex-1">
          <div className="container p-4 md:p-6 lg:p-8">
            {portal === 'business' ? <BusinessSalonSwitcher /> : null}
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
