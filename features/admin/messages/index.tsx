import { getMessagesDashboard } from './api/queries'
import { MessagesClient } from './components/messages-client'

export async function AdminMessages() {
  const dashboard = await getMessagesDashboard()
  return <MessagesClient {...dashboard} />
}
