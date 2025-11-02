'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { getNavIcon, type IconName } from '../../constants/icon-map'

interface NavItem {
  title: string
  url: string
  icon: IconName
  isActive?: boolean
  badge?: number
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

export const NavMain = memo(function NavMain({
  items,
  label = "Platform",
}: {
  items: NavItem[]
  label?: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = getNavIcon(item.icon)
          const hasSubItems = item.items && item.items.length > 0

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasSubItems ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={item.isActive} aria-current={item.isActive ? 'page' : undefined}>
                        <Icon className="size-4" aria-hidden="true" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" aria-hidden="true" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.badge && item.badge > 0 && (
                      <SidebarMenuBadge>{item.badge > 99 ? '99+' : item.badge}</SidebarMenuBadge>
                    )}
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                      <Link href={item.url} aria-current={item.isActive ? 'page' : undefined}>
                        <Icon className="size-4" aria-hidden="true" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && item.badge > 0 && (
                      <SidebarMenuBadge aria-label={`${item.badge > 99 ? 'More than 99' : item.badge} notifications`}>{item.badge > 99 ? '99+' : item.badge}</SidebarMenuBadge>
                    )}
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
})
