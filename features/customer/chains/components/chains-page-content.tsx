import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { ChainsList } from '.'
import { getSalonChains } from '../api/queries'

async function SalonChains() {
  const chains = await getSalonChains()
  return <ChainsList chains={chains} />
}

export function ChainsPageContent() {
  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <Item variant="muted" className="flex-col items-start gap-2">
          <ItemContent>
            <ItemTitle>Salon Chains</ItemTitle>
            <ItemDescription>Discover salon chains with multiple locations</ItemDescription>
          </ItemContent>
        </Item>
        <Suspense fallback={<div className="flex justify-center py-12"><Spinner /></div>}>
          <SalonChains />
        </Suspense>
      </div>
    </section>
  )
}
