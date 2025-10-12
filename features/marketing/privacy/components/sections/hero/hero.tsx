import { MarketingHero } from '@/components/marketing/hero-section'
import { heroData } from './hero.data'

export function Hero() {
  return <MarketingHero {...heroData} variant="stacked" align="center" />
}
