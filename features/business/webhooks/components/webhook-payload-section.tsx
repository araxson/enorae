import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

type PayloadSectionProps = {
  payload: unknown
}

export function WebhookPayloadSection({ payload }: PayloadSectionProps) {
  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader>
        <ItemTitle>Payload</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ScrollArea className="max-h-60">
          <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
            <code>{JSON.stringify(payload, null, 2)}</code>
          </pre>
        </ScrollArea>
      </ItemContent>
    </Item>
  )
}
