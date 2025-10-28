import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Item, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Mail, MapPin, Phone } from 'lucide-react'
import { infoData } from './info.data'

export function Info() {
  return (
    <div
      className="group/item-group flex flex-col gap-6"
      data-slot="item-group"
      role="list"
    >
      <Card>
        <CardHeader>
          <CardTitle>{infoData.title}</CardTitle>
          <CardDescription>
            Contact our team directly using the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="group/item-group flex flex-col gap-4"
            data-slot="item-group"
            role="list"
          >
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support hours</CardTitle>
          <CardDescription>
            Availability window for customer assistance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="group/item-group flex flex-col gap-2"
            data-slot="item-group"
            role="list"
          >
            {infoData.supportHours.map(({ label, value }) => (
              <Item key={label} variant="muted">
                <ItemHeader>
                  <ItemTitle>{label}</ItemTitle>
                  <ItemDescription>{value}</ItemDescription>
                </ItemHeader>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
