'use client'

import { usePathname } from 'next/navigation'
import { Header, Footer } from '@/components/layout'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Portal routes that have their own internal headers
  const portalRoutes = ['/customer', '/business', '/staff', '/admin']
  const isPortalPage = portalRoutes.some((route) => pathname?.startsWith(route))

  // If it's a portal page, don't render marketing Header/Footer
  if (isPortalPage) {
    return <>{children}</>
  }

  // For marketing pages, render Header/Footer
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
