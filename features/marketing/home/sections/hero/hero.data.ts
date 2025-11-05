import type { TrustBadgeType } from '@/features/marketing/components/common/trust-badge'

type HeroTrustBadge = {
  type: TrustBadgeType
  text?: string
}

export const heroContent = {
  title: 'Enorae',
  subtitle: 'Your Beauty Appointments, Simplified',
  description:
    'The modern platform connecting clients with premier salons. Book appointments, manage your business, and grow your beauty brand.',
  primaryCta: {
    label: 'Find salons',
    href: '/explore',
  },
  secondaryCta: {
    label: 'Get started free',
    href: '/signup',
  },
  trustBadges: [
    { type: 'verified', text: '500+ Verified Salons' },
    { type: 'rated', text: '4.8 Average Rating' },
    { type: 'popular', text: '10,000+ Happy Customers' },
    { type: 'secure' },
  ] satisfies HeroTrustBadge[],
}
