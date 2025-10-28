import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Database } from '@/lib/types/database.types'
import { Clock, DollarSign, Sparkles } from 'lucide-react'

type Service = Database['public']['Views']['services_view']['Row']

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const hasPrice = service['current_price'] !== null
  const hasSalePrice = service['sale_price'] !== null && service['sale_price'] < (service['current_price'] || 0)

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {service['category_name'] && (
            <Badge variant="secondary">
              <Link href={`/services/${service['category_slug']}`} className="no-underline">
                {service['category_name']}
              </Link>
            </Badge>
          )}
          {service['is_featured'] && (
            <div className="flex items-center gap-2">
              <Sparkles className="size-3" aria-hidden="true" />
              <Badge variant="default">Featured</Badge>
            </div>
          )}
        </div>
        <CardTitle>{service['name']}</CardTitle>
        {service['description'] ? (
          <div className="line-clamp-3">
            <CardDescription>{service['description']}</CardDescription>
          </div>
        ) : null}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex-1">
          <div
            className="group/item-group flex flex-col gap-3"
            data-slot="item-group"
            role="list"
          >
            {service['duration_minutes'] && (
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <Clock className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>{service['duration_minutes']} minutes</ItemDescription>
                </ItemContent>
              </Item>
            )}
            {hasPrice && (
              <Item variant="muted">
                <ItemMedia variant="icon">
                  <DollarSign className="size-4" aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  {hasSalePrice ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="line-through text-muted-foreground">
                        ${service['current_price']?.toFixed(2)}
                      </span>
                      <ItemTitle>${service['sale_price']?.toFixed(2)}</ItemTitle>
                      <Badge variant="destructive">Sale</Badge>
                    </div>
                  ) : (
                    <ItemDescription>${service['current_price']?.toFixed(2)}</ItemDescription>
                  )}
                </ItemContent>
              </Item>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/services/${service['category_slug']}`}>View Salons</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
