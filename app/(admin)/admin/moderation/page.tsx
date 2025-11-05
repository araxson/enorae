import type { Metadata } from 'next'
import { AdminModeration } from '@/features/admin/moderation'

export const metadata: Metadata = {
  title: 'Content Moderation - Admin Portal - ENORAE',
  description: 'Review and moderate user-generated content and reviews',
}

export default function AdminModerationPage() {
  return <AdminModeration />
}
