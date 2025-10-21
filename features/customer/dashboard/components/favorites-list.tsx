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
import type { CustomerFavoriteView } from '@/lib/types/app.types'

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
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No favorites yet</p>
            <Button variant="outline" asChild>
              <Link href="/customer/salons">Explore salons</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your favorites</CardTitle>
        <small className="text-sm font-medium">{favorites.length} saved items</small>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup>
          {favorites.map((favorite, index) => (
            <div key={favorite.id}>
              <Item variant="outline" size="sm">
                <ItemMedia variant="icon">
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {favorite.business_name || 'Favorite salon'}
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
          <Link href="/customer/favorites">View all favorites</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
