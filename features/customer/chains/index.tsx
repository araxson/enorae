import { Section, Stack, Box } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'
import { notFound } from 'next/navigation'
import { getSalonChains, getSalonChainById } from './api/queries'
import { ChainsList } from './components/chains-list'
import { ChainDetail } from './components/chain-detail'

export async function SalonChains() {
  const chains = await getSalonChains()
  return <ChainsList chains={chains} />
}

export function CustomerChainsPage() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <Box>
          <H1>Salon Chains</H1>
          <P className="text-muted-foreground">
            Discover salon chains with multiple locations
          </P>
        </Box>

        <SalonChains />
      </Stack>
    </Section>
  )
}

export async function SalonChainDetailPage({ slug }: { slug: string }) {
  const chain = await getSalonChainById(slug)

  if (!chain) {
    notFound()
  }

  return (
    <Section size="lg">
      <ChainDetail chain={chain} />
    </Section>
  )
}

export { getSalonChains, getSalonChainById, getChainLocations } from './api/queries'
export type { SalonChainWithLocations } from './api/queries'
