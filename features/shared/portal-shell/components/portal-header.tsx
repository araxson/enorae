'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { DynamicBreadcrumbs } from './navigation/breadcrumbs'
import { CommandMenu } from './navigation/command-menu'
import { PortalQuickNav } from './navigation/portal-quick-nav'

export function PortalHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumbs />
        </div>
        <div className="flex items-center gap-3">
          <PortalQuickNav />
          <CommandMenu />
        </div>
      </div>
    </header>
  )
}
