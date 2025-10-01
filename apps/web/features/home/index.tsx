import { HeroSection } from './components/hero-section'
import { SalonSearch } from './components/salon-search'
import { FeaturedSalons } from './components/featured-salons'
import { getHomepageData } from './dal/home.queries'

export async function HomePage() {
  const data = await getHomepageData()

  return (
    <main className="min-h-screen">
      <HeroSection />
      <SalonSearch />
      <FeaturedSalons salons={data.featuredSalons} />
    </main>
  )
}