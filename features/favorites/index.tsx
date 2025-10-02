import { getUserFavorites } from './dal/favorites.queries'
import { FavoritesList } from './components/favorites-list'
import { Section, Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function Favorites() {
  const favorites = await getUserFavorites()

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Stack gap="sm">
          <H1>My Favorite Salons</H1>
          <P>Quick access to your favorite salons and services</P>
        </Stack>

        <FavoritesList favorites={favorites} />
      </Stack>
    </Section>
  )
}
