import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getStatusVariant } from './utils'
import type { AppointmentDetailContentProps } from './types'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item'

export function AppointmentHeader({ appointment }: Pick<AppointmentDetailContentProps, 'appointment'>) {
  if (!appointment) return null
  const statusLabel = (appointment['status'] ?? 'pending')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <>
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemDescription>{appointment['confirmation_code'] || 'No code'}</ItemDescription>
          </ItemContent>
          <ItemActions className="flex-none">
            <Badge variant={getStatusVariant(appointment['status'])}>{statusLabel}</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
      <Separator />
    </>
  )
}
