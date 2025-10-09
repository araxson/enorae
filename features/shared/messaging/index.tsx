import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getMessageThreadsByUser } from './api/queries'
import { ThreadList } from './components/thread-list'
import { H1, P } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export async function Messaging() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const threads = await getMessageThreadsByUser()

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <H1>Messages</H1>
        <P className="text-muted-foreground">
          Communicate with salons about your appointments.
        </P>
      </div>

      <Separator />

      <ThreadList threads={threads} />
    </div>
  )
}
