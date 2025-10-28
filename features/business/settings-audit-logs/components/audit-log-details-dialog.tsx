'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { AuditLog } from '@/features/business/settings-audit-logs/api/queries'

interface AuditLogDetailsDialogProps {
  log: AuditLog | null
  isOpen: boolean
  onClose: () => void
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatActionLabel = (action: string) =>
  action
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

export function AuditLogDetailsDialog({ log, isOpen, onClose }: AuditLogDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Complete information about this audit log entry
          </DialogDescription>
        </DialogHeader>

        {log && (
          <div className="space-y-4">
            <FieldSet className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Timestamp</FieldLabel>
                <FieldContent>
                  <FieldDescription>{formatDate(log.created_at)}</FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Action</FieldLabel>
                <FieldContent>
                  <FieldDescription>{formatActionLabel(log.action)}</FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Entity type</FieldLabel>
                <FieldContent>
                  <FieldDescription>
                    <span className="capitalize">{log.entity_type}</span>
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Entity ID</FieldLabel>
                <FieldContent>
                  <FieldDescription>{log.entity_id || 'N/A'}</FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>User ID</FieldLabel>
                <FieldContent>
                  <FieldDescription>{log.user_id}</FieldDescription>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>IP address</FieldLabel>
                <FieldContent>
                  <FieldDescription>{log.ip_address || 'N/A'}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldSet>

            {log.user_agent && (
              <Field>
                <FieldLabel>User agent</FieldLabel>
                <FieldContent>
                  <ScrollArea className="rounded bg-muted">
                    <pre className="p-3 text-xs text-muted-foreground">
                      {log.user_agent}
                    </pre>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </FieldContent>
              </Field>
            )}

            {log.old_values && Object.keys(log.old_values).length > 0 && (
              <Field>
                <FieldLabel>Old values</FieldLabel>
                <FieldContent>
                  <ScrollArea className="rounded bg-muted">
                    <pre className="p-3 text-xs text-muted-foreground">
                      {JSON.stringify(log.old_values, null, 2)}
                    </pre>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </FieldContent>
              </Field>
            )}

            {log.new_values && Object.keys(log.new_values).length > 0 && (
              <Field>
                <FieldLabel>New values</FieldLabel>
                <FieldContent>
                  <ScrollArea className="rounded bg-muted">
                    <pre className="p-3 text-xs text-muted-foreground">
                      {JSON.stringify(log.new_values, null, 2)}
                    </pre>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </FieldContent>
              </Field>
            )}

            {log.error_message && (
              <Field className="gap-2">
                <FieldLabel>Error message</FieldLabel>
                <FieldContent>
                  <Alert variant="destructive">
                    <AlertTitle>Operation failed</AlertTitle>
                    <AlertDescription>{log.error_message}</AlertDescription>
                  </Alert>
                </FieldContent>
              </Field>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
