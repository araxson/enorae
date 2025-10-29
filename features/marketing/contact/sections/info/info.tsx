import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Mail, MapPin, Phone } from 'lucide-react'
import { infoData } from './info.data'

export function Info() {
  return (
    <ItemGroup className="gap-6">
      <Item variant="outline" className="flex flex-col gap-4">
        <ItemHeader className="flex flex-col gap-2">
          <ItemTitle>
            <h2 className="text-xl font-semibold tracking-tight">
              {infoData.title}
            </h2>
          </ItemTitle>
          <p className="text-muted-foreground">
            Contact our team directly using the details below.
          </p>
        </ItemHeader>
        <ItemContent>
          <ItemGroup className="gap-4">
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Mail className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>General inquiries</ItemTitle>
                <ItemDescription>{infoData.email}</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted">
              <ItemMedia variant="icon">
                <Phone className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Phone</ItemTitle>
                <ItemDescription>{infoData.phone}</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted">
              <ItemMedia variant="icon">
                <MapPin className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>HQ address</ItemTitle>
                <ItemDescription>{infoData.address}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex flex-col gap-4">
        <ItemHeader className="flex flex-col gap-2">
          <ItemTitle>
            <h2 className="text-xl font-semibold tracking-tight">Support hours</h2>
          </ItemTitle>
          <p className="text-muted-foreground">
            Availability window for customer assistance.
          </p>
        </ItemHeader>
        <ItemContent>
          <ItemGroup className="gap-2">
            {infoData.supportHours.map(({ label, value }) => (
              <Item key={label} variant="muted">
                <ItemHeader>
                  <ItemTitle>{label}</ItemTitle>
                  <ItemDescription>{value}</ItemDescription>
                </ItemHeader>
              </Item>
            ))}
          </ItemGroup>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
