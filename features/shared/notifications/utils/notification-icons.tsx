import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'

export function getChannelIcon(contextType: string | null) {
  if (!contextType) return <Bell className="size-4" aria-hidden="true" />
  if (contextType === 'email') return <Mail className="size-4" aria-hidden="true" />
  if (contextType === 'sms') return <MessageSquare className="size-4" aria-hidden="true" />
  if (contextType === 'push') return <Smartphone className="size-4" aria-hidden="true" />
  return <Bell className="size-4" aria-hidden="true" />
}
