import { MarketingHero } from '@/features/marketing/common-components'
import { heroData } from './hero.data'

export function Hero() {
  return <MarketingHero {...heroData} variant="stacked" align="center" />
}
