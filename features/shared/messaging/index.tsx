import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { getMessageThreadsByUser } from './api/queries'
import { ThreadList } from './components/thread-list'
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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Messages</h1>
        <p className="leading-7 text-muted-foreground">
          Communicate with salons about your appointments.
        </p>
      </div>

      <Separator />

      <ThreadList threads={threads} />
    </div>
  )
}
