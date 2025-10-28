import { MessagesFeature, MessageThreadPage } from './components'
import { getMyMessageThreads } from './api/queries'

export async function StaffMessagesPage() {
  const threads = await getMyMessageThreads()

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <MessagesFeature threads={threads} />
    </section>
  )
}

export { MessageThreadPage as StaffMessageThreadPage }
