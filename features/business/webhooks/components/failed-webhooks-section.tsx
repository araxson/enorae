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
              {isRefreshing ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 size-4" />}
              Refresh
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
      {failedWebhooks.map((webhook) => (
        <Alert key={webhook.id} variant="destructive">
          <AlertCircle className="size-4" />
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <AlertTitle>{webhook.url}</AlertTitle>
              <Button variant="outline" size="sm">
                Retry
              </Button>
            </div>
            <AlertDescription>Event: {webhook.event_type}</AlertDescription>
            {webhook.error_message ? (
              <p className="text-sm text-muted-foreground">Error: {webhook.error_message}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">{new Date(webhook.created_at).toLocaleString()}</p>
          </div>
        </Alert>
      ))}
    </div>
  )
}
