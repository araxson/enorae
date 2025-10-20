import { generateMetadata as genMeta } from '@/lib/metadata'

export const profileMetadata = genMeta({
  title: 'My Profile',
  description: 'Manage your profile and view your appointment history.',
  noIndex: true,
})
