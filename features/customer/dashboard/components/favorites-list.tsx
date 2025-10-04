import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { Small, Muted } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from '@/components/ui/item'
import type { CustomerFavoriteView } from '@/lib/types/app.types'
import { Heart } from 'lucide-react'
import Link from 'next/link'

interface FavoritesListProps {
  favorites: CustomerFavoriteView[]
}

export function FavoritesList({ favorites }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="md" className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
            <Muted>No favorites yet</Muted>
            <Button variant="outline" asChild>
              <Link href="/customer/salons">Explore Salons</Link>
            </Button>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Favorites</CardTitle>
        <Small>{favorites.length} saved items</Small>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <ItemGroup>
            {favorites.map((favorite, index) => (
              <div key={favorite.id}>
                <Item variant="outline" size="sm">
                  <ItemMedia variant="icon">
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {favorite.business_name || 'Favorite Salon'}
                    </ItemTitle>
                    <ItemDescription>
                      {favorite.category_name || 'No category'}
                    </ItemDescription>
                  </ItemContent>
                </Item>
                {index < favorites.length - 1 && <ItemSeparator />}
              </div>
            ))}
          </ItemGroup>
          <Button variant="outline" asChild className="w-full">
            <Link href="/customer/favorites">View All Favorites</Link>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
