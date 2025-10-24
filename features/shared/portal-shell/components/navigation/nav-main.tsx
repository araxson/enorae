'use client'

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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { getNavIcon, type IconName } from './icon-map'

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

export function NavMain({
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
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={item.isActive}
                        className="w-full"
                        type="button"
                      >
                        <div className="flex w-full items-center gap-2">
                          <Icon className="size-4" />
                          <span className="flex-1 truncate text-left">{item.title}</span>
                          {item.badge && item.badge > 0 && (
                            <div className="ml-auto">
                              <Badge variant="default">
                                {item.badge > 99 ? '99+' : item.badge}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <SidebarMenuAction
                          asChild
                          className="data-[state=open]:rotate-90 transition-transform"
                        >
                          <span className="flex items-center">
                            <ChevronRight className="size-4" />
                            <span className="sr-only">Toggle {item.title}</span>
                          </span>
                        </SidebarMenuAction>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.isActive}
                            >
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
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={item.isActive}
                  >
                    <Link href={item.url}>
                      <Icon className="size-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && item.badge > 0 && (
                        <div className="ml-auto">
                          <Badge variant="default">
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
