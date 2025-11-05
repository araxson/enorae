export const listingCopy = {
  badge: 'Discover',
  title: 'Find your next favourite salon',
  description:
    'Browse top-rated salons and beauty professionals near you. Book instantly and get the VIP treatment you deserve.',
  filtersLabel: 'Salon categories',
  emptyTitle: 'No salons match your search',
  emptyDescription: 'Try a different city or service to discover more locations.',
  resetLabel: 'Reset search',
  searchPlaceholder: 'Search by salon, service, or city',
  searchButton: 'Search',
  ctaLabel: 'Book with Enorae',
  resultsSummary: (visible: number, total: number) => {
    const noun = total === 1 ? 'salon' : 'salons'
    return `Showing ${visible} of ${total} curated ${noun}`
  },
  hoverPreviewTitle: 'About this salon',
  hoverPreviewFallback: 'This salon is preparing a detailed description. Check back soon!',
}

export const listingFilters = [
  {
    value: 'all',
    label: 'All',
    description: 'Every verified salon in the directory.',
  },
  {
    value: 'top-rated',
    label: 'Top Rated',
    description: 'Salons with a rating of 4.5 or higher.',
  },
  {
    value: 'new',
    label: 'New',
    description: 'Fresh listings added in the last 90 days.',
  },
] as const
