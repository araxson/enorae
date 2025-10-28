import { Notifications as SharedNotifications } from '@/features/shared/notifications'
import { Bell } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export async function Notifications() {
  return (
    <section className="mx-auto w-full px-6 max-w-6xl pb-16 pt-6">
      <ItemGroup className="mb-6">
        <Item variant="muted" size="sm">
          <ItemMedia variant="icon">
            <Bell className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Notifications</ItemTitle>
          </ItemContent>
        </Item>
      </ItemGroup>
      <SharedNotifications />
    </section>
  )
}
