import 'server-only'

import { generateMetadata as genMeta } from '@/lib/metadata'

export function generateChainsMetadata() {
  return genMeta({
    title: 'Salon Chains',
    description: 'Browse popular salon chains and discover multiple locations near you. Find consistent quality across all branches.',
    keywords: ['salon chains', 'chain salons', 'multiple locations', 'salon branches', 'franchise salons'],
  })
}
