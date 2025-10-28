import { notFound } from 'next/navigation'
import { ChainDetail } from '.'
import { getSalonChainById } from '../api/queries'

type ChainDetailContentProps = {
  slug: string
}

export async function ChainDetailContent({ slug }: ChainDetailContentProps) {
  const chain = await getSalonChainById(slug)
  if (!chain) notFound()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <ChainDetail chain={chain} />
    </section>
  )
}
