'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { DynamicBreadcrumbs } from '../navigation/breadcrumbs'

export function PortalHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="shrink-0" />
      <Separator orientation="vertical" className="h-4" />
      <DynamicBreadcrumbs />
    </header>
  )
}