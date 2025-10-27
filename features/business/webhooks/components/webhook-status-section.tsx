import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { Database } from '@/lib/types/database.types'
import { STATUS_COLORS } from './webhook-detail-constants'
import { Field, FieldContent, FieldLabel, FieldSet } from '@/components/ui/field'

type WebhookQueue = Database['public']['Views']['communication_webhook_queue_view']['Row']

type WebhookStatusSectionProps = {
  webhook: WebhookQueue
}

const LABEL_WIDTH = 'w-32'
const DATE_FORMAT = 'MMM dd, yyyy HH:mm:ss'

export function WebhookStatusSection({ webhook }: WebhookStatusSectionProps) {
  const statusKey = webhook['status'] ?? 'pending'

  return (
    <FieldSet className="flex flex-col gap-4">
      <Field orientation="horizontal" className="items-center gap-3">
        <FieldLabel>Status</FieldLabel>
        <FieldContent className="flex items-center gap-2">
          <Badge variant={STATUS_COLORS[statusKey] ?? 'secondary'}>
            {webhook['status'] ?? 'pending'}
          </Badge>
        </FieldContent>
      </Field>

      <FieldSet className="flex flex-col gap-3">
        <DetailRow label="URL" value={webhook['url'] ?? 'N/A'} />
        <DetailRow label="Attempts" value={String(webhook['attempts'] || 0)} />
        <DetailRow label="Created" value={webhook['created_at'] ? format(new Date(webhook['created_at']), DATE_FORMAT) : 'N/A'} />

        {webhook['completed_at'] && (
          <DetailRow
            label="Completed"
            value={format(new Date(webhook['completed_at']), DATE_FORMAT)}
          />
        )}

        {webhook['next_retry_at'] && (
          <DetailRow
            label="Next retry"
            value={format(new Date(webhook['next_retry_at']), DATE_FORMAT)}
          />
        )}
      </FieldSet>
    </FieldSet>
  )
}

type DetailRowProps = {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Field orientation="horizontal" className="items-start gap-3">
      <FieldLabel className={LABEL_WIDTH}>{label}</FieldLabel>
      <FieldContent>
        <span className="text-sm font-medium break-all">{value}</span>
      </FieldContent>
    </Field>
  )
}
