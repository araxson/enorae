import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'

type SalonDescription = Database['public']['Views']['salons_view']['Row']

interface SalonDescriptionProps {
  description: SalonDescription
}

export function SalonDescriptionComponent({ description }: SalonDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-6">
          {description.short_description ? (
            <Item>
              <ItemContent>
                <ItemDescription>
                  <span className="text-foreground">{description.short_description}</span>
                </ItemDescription>
              </ItemContent>
            </Item>
          ) : null}

          {description.full_description ? (
            <>
              <ItemSeparator />
              <Item>
                <ItemContent>
                  <ItemDescription>
                    <span className="whitespace-pre-line text-muted-foreground">
                      {description.full_description}
                    </span>
                  </ItemDescription>
                </ItemContent>
              </Item>
            </>
          ) : null}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
