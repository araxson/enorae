import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

type PayloadSectionProps = {
  payload: unknown
}

export function WebhookPayloadSection({ payload }: PayloadSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payload</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-60">
          <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
            <code>{JSON.stringify(payload, null, 2)}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
