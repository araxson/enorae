import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getSalonChains, getSalonChainById } from './api/queries'
import { ChainsList } from './components/chains-list'
import { ChainDetail } from './components/chain-detail'
import { Spinner } from '@/components/ui/spinner'

export async function SalonChains() {
  const chains = await getSalonChains()
  return <ChainsList chains={chains} />
}

export function CustomerChainsPage() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Salon Chains</h1>
          <p className="leading-7 text-muted-foreground">
            Discover salon chains with multiple locations
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          }
        >
          <SalonChains />
        </Suspense>
      </div>
    </section>
  )
}

export async function SalonChainDetailPage({ slug }: { slug: string }) {
  const chain = await getSalonChainById(slug)

  if (!chain) {
    notFound()
  }

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ChainDetail chain={chain} />
    </section>
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
