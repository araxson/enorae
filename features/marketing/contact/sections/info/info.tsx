import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Mail, MapPin, Phone } from 'lucide-react'
import { MarketingPanel } from '@/features/marketing/components/common'
import { infoData } from './info.data'

export function Info() {
  return (
    <ItemGroup className="gap-6">
      <MarketingPanel
        variant="outline"
        align="start"
        title={infoData.title}
        description="Contact our team directly using the details below."
      >
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
      </MarketingPanel>

      <MarketingPanel
        variant="outline"
        align="start"
        title="Support hours"
        description="Availability window for customer assistance."
      >
        <ItemGroup className="gap-2">
          {infoData.supportHours.map(({ label, value }) => (
            <Item key={label} variant="muted">
              <ItemContent>
                <ItemTitle>{label}</ItemTitle>
                <ItemDescription>{value}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </MarketingPanel>
    </ItemGroup>
  )
}
