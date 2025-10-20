import { Stack } from '@/components/layout'

type PayloadSectionProps = {
  payload: unknown
}

export function WebhookPayloadSection({ payload }: PayloadSectionProps) {
  return (
    <Stack gap="sm">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Payload</h4>
      <div className="rounded-md bg-muted p-4 overflow-x-auto">
        <pre className="text-xs">
          <code>{JSON.stringify(payload, null, 2)}</code>
        </pre>
      </div>
    </Stack>
  )
}
