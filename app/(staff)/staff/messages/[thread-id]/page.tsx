import { StaffMessageThreadPage } from '@/features/staff/messages'

interface ThreadPageProps {
  params: Promise<{ 'thread-id': string }>
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { 'thread-id': threadId } = await params
  return <StaffMessageThreadPage threadId={threadId} />
}
