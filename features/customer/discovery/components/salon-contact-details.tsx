import { Phone, Mail, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Database } from '@/lib/types/database.types'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type SalonContactDetails = Database['public']['Views']['salons_view']['Row']

interface SalonContactDetailsProps {
  contactDetails: SalonContactDetails
}

export function SalonContactDetails({ contactDetails }: SalonContactDetailsProps) {
  const contactMethods = [
    {
      icon: Phone,
      label: 'Phone',
      value: contactDetails['primary_phone'],
      action: contactDetails['primary_phone'] ? (
        <Button size="sm" variant="outline" asChild>
          <a href={`tel:${contactDetails['primary_phone']}`}>Call</a>
        </Button>
      ) : null,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactDetails['primary_email'],
      action: contactDetails['primary_email'] ? (
        <Button size="sm" variant="outline" asChild>
          <a href={`mailto:${contactDetails['primary_email']}`}>Email</a>
        </Button>
      ) : null,
    },
    {
      icon: Globe,
      label: 'Website',
      value: contactDetails['website_url'],
      action: contactDetails['website_url'] ? (
        <Button size="sm" variant="outline" asChild>
          <a href={contactDetails['website_url']} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        </Button>
      ) : null,
    },
  ].filter((method) => method.value)

  if (contactMethods.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Phone className="h-6 w-6" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No contact information available</EmptyTitle>
          <EmptyDescription>
            The salon has not shared contact details yet. Check back later for updates.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          Follow the salon to receive updates as soon as contact options are added.
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Contact information</ItemTitle>
              <ItemDescription>Reach the salon using the channels below.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <Item key={method.label} variant="outline">
                <ItemMedia variant="icon">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{method.label}</ItemTitle>
                  <ItemDescription>
                    <span className="break-all text-foreground">{method.value}</span>
                  </ItemDescription>
                </ItemContent>
                {method.action ? <ItemActions className="flex-none">{method.action}</ItemActions> : null}
              </Item>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
