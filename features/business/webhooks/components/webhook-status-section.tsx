import { Badge } from '@/components/ui/badge'
import { Flex, Stack } from '@/components/layout'
import { H4, Small } from '@/components/ui/typography'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'
import { STATUS_COLORS } from './webhook-detail-constants'

type WebhookQueue = Database['public']['Views']['communication_webhook_queue']['Row']

type WebhookStatusSectionProps = {
  webhook: WebhookQueue
}

const LABEL_WIDTH = 'w-32'
const DATE_FORMAT = 'MMM dd, yyyy HH:mm:ss'

export function WebhookStatusSection({ webhook }: WebhookStatusSectionProps) {
  const statusKey = webhook.status ?? 'pending'

  return (
    <Stack gap="md">
      <Flex gap="md" align="center">
        <H4 className="mb-0">Status</H4>
        <Badge variant={STATUS_COLORS[statusKey] ?? 'secondary'}>
          {webhook.status ?? 'pending'}
        </Badge>
      </Flex>

      <Stack gap="sm">
        <DetailRow label="URL" value={webhook.url ?? 'N/A'} />
        <DetailRow label="Attempts" value={String(webhook.attempts || 0)} />
        <DetailRow label="Created" value={webhook.created_at ? format(new Date(webhook.created_at), DATE_FORMAT) : 'N/A'} />

        {webhook.completed_at && (
          <DetailRow
            label="Completed"
            value={format(new Date(webhook.completed_at), DATE_FORMAT)}
          />
        )}

        {webhook.next_retry_at && (
          <DetailRow
            label="Next Retry"
            value={format(new Date(webhook.next_retry_at), DATE_FORMAT)}
          />
        )}
      </Stack>
    </Stack>
  )
}

type DetailRowProps = {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Flex gap="sm">
      <Small className={`text-muted-foreground ${LABEL_WIDTH}`}>{label}:</Small>
      <Small className="break-all">{value}</Small>
    </Flex>
  )
}
