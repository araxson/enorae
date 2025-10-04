import { Messaging } from '@/features/shared/messaging'

export const metadata = {
  title: 'Messages',
  description: 'Your conversations with salons',
}

export default async function MessagesPage() {
  return <Messaging />
}
