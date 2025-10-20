import { Section, Stack, Box } from '@/components/layout'
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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Salon Chains</h1>
          <p className="leading-7 text-muted-foreground">
            Discover salon chains with multiple locations
          </p>
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

export async function SalonChainDetailFeature({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const resolved = await params

  return <SalonChainDetailPage slug={resolved.slug} />
}

export { getSalonChains, getSalonChainById, getChainLocations } from './api/queries'
export type { SalonChainWithLocations } from './api/queries'
