import { getMessagesDashboard } from './api/queries'
import { MessagesClient } from './components'

export async function AdminMessages() {
  const dashboard = await getMessagesDashboard()
  return <MessagesClient {...dashboard} />
}
export type * from './api/types'
