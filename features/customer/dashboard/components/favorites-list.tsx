import { Fragment } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemSeparator,
} from '@/components/ui/item'
import type { CustomerFavoriteView } from '@/features/customer/favorites'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

interface FavoritesListProps {
  favorites: CustomerFavoriteView[]
}

export function FavoritesList({ favorites }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your favorites</CardTitle>
          <CardDescription>Save salons to rebook faster next time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyMedia variant="icon">
              <Heart className="h-6 w-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No favorites yet</EmptyTitle>
              <EmptyDescription>Save salons to rebook faster next time.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" asChild>
                <Link href="/customer/salons">Explore salons</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your favorites</CardTitle>
        <CardDescription>{favorites.length} saved items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup>
          {favorites.map((favorite, index) => (
            <Fragment key={favorite['id']}>
              <Item variant="outline" size="sm">
                <ItemMedia variant="icon">
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {favorite['business_name'] || 'Favorite salon'}
                  </ItemTitle>
                  <ItemDescription>
                    {favorite['category_name'] || 'No category'}
                  </ItemDescription>
                </ItemContent>
              </Item>
              {index < favorites.length - 1 ? <ItemSeparator /> : null}
            </Fragment>
          ))}
        </ItemGroup>
        <Button variant="outline" asChild className="w-full">
          <Link href="/customer/favorites">View all favorites</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
