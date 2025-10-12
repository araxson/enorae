'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { MoreHorizontal, Trash2, Star } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { getNavIcon, type IconName } from './icon-map'
import { toggleFavorite } from '@/features/customer/favorites/api/mutations'

interface FavoriteItem {
  name: string
  url: string
  icon: IconName
  salonId?: string
}

export function NavFavorites({
  favorites,
}: {
  favorites: FavoriteItem[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleRemoveFavorite = (salonId?: string) => {
    if (!salonId) {
      toast.error('Unable to remove this favorite. Please try again later.')
      return
    }

    setPendingId(salonId)
    startTransition(() => {
      void toggleFavorite(salonId)
        .then((result) => {
          if (!result.success) {
            toast.error(result.error)
            return
          }

          toast.success('Removed from favorites')
          router.refresh()
        })
        .finally(() => {
          setPendingId((prev) => (prev === salonId ? null : prev))
        })
    })
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <Star className="mr-2 size-4" />
        Favorites
      </SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((item) => {
          const Icon = getNavIcon(item.icon)

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">More options</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem asChild>
                    <Link href={item.url}>
                      <Star className="mr-2 size-4 text-muted-foreground" />
                      <span>View Details</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleRemoveFavorite(item.salonId)}
                    className="text-destructive cursor-pointer"
                    disabled={isPending && pendingId === item.salonId}
                    aria-busy={isPending && pendingId === item.salonId}
                  >
                    <Trash2 className="mr-2 size-4" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
        {favorites.length === 0 && (
          <SidebarMenuItem>
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No favorites yet
            </div>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
