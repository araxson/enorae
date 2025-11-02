'use client'

import Link from 'next/link'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getNavIcon, type IconName } from '../../constants/icon-map'
import { cn } from '@/lib/utils'

interface NavSecondaryItem {
  title: string
  url: string
  icon: IconName
}

export function NavSecondary({
  items,
  className,
}: {
  items: NavSecondaryItem[]
  className?: string
}) {
  return (
    <SidebarGroup className={cn("mt-auto", className)}>
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = getNavIcon(item.icon)

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <Icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}