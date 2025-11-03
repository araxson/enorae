import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'

export function FooterBrand() {
  return (
    <div className="flex flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Sparkles className="size-6" aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Enorae</ItemTitle>
          <ItemDescription>
            Your Beauty Appointments, Simplified. The modern platform connecting clients with premier salons.
          </ItemDescription>
        </ItemContent>
      </Item>
      <div
        className="group/item-group flex flex-col gap-2"
        data-slot="item-group"
        role="list"
      >
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Mail className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemDescription>support@enorae.com</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <Phone className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemDescription>1-800-ENORAE</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <MapPin className="size-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemDescription>San Francisco, CA</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </div>
  )
}
