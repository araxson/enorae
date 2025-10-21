import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge'
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h4 className="scroll-m-20 text-xl font-semibold mb-0">Status</h4>
        <Badge variant={STATUS_COLORS[statusKey] ?? 'secondary'}>
          {webhook.status ?? 'pending'}
        </Badge>
      </div>

      <div className="flex flex-col gap-3">
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
      </div>
    </div>
  )
}

type DetailRowProps = {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3">
      <p className={cn('text-sm font-medium', `text-muted-foreground ${LABEL_WIDTH}`)}>{label}:</p>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  )
}
