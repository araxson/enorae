'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'

interface FailedWebhook {
  id: string
  url: string
  event_type: string
  error_message: string | null
  created_at: string
}

type FailedWebhooksSectionProps = {
  failedWebhooks: FailedWebhook[]
}

export function FailedWebhooksSection({ failedWebhooks }: FailedWebhooksSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  if (failedWebhooks.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemTitle>Failed Webhooks</ItemTitle>
          </ItemContent>
          <ItemActions className="flex-none">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
      {failedWebhooks.map((webhook) => (
        <Alert key={webhook.id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>{webhook.url}</span>
            <Button variant="outline" size="sm">
              Retry
            </Button>
          </AlertTitle>
          <AlertDescription className="space-y-1">
            <p className="text-sm">Event: {webhook.event_type}</p>
            {webhook.error_message && <p className="text-sm">Error: {webhook.error_message}</p>}
            <p className="text-xs opacity-70">{new Date(webhook.created_at).toLocaleString()}</p>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
