'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { H3 } from '@/components/ui/typography'

export interface MenuItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface MenuSection {
  label: string
  items: MenuItem[]
}

export interface PortalSidebarProps {
  title: string
  sections: MenuSection[]
  version?: string
}

export function PortalSidebar({ title, sections, version = 'v1.0' }: PortalSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <H3 className="text-sidebar-foreground">{title}</H3>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section, index) => (
          <div key={section.label}>
            {index > 0 && <SidebarSeparator />}
            <SidebarGroup>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.url ||
                      (item.url !== '/' && pathname.startsWith(item.url))

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/60">
          {version}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
