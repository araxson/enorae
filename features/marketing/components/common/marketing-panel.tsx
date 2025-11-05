import { type ReactNode } from 'react'

import { cn } from '@/lib/utils/index'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type MarketingPanelProps = {
  variant?: 'default' | 'outline' | 'muted'
  media?: ReactNode
  mediaVariant?: 'default' | 'icon' | 'image'
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  align?: 'start' | 'center'
}

export function MarketingPanel({
  variant = 'outline',
  media,
  mediaVariant = 'default',
  title,
  description,
  actions,
  children,
  align = 'start',
}: MarketingPanelProps) {
  const isCenterAligned = align === 'center'

  return (
    <Item variant={variant}>
      {media ? (
        <div
          className={cn(
            'flex w-full',
            isCenterAligned ? 'justify-center' : 'justify-start',
          )}
        >
          <ItemMedia variant={mediaVariant}>{media}</ItemMedia>
        </div>
      ) : null}
      <ItemContent>
        <div className="flex flex-col gap-4">
          {title ? (
            <div
              className={cn(
                'flex w-full',
                isCenterAligned ? 'justify-center text-center' : 'justify-start text-left',
              )}
            >
              <ItemTitle>{title}</ItemTitle>
            </div>
          ) : null}
          {description ? (
            <div
              className={cn(
                'flex w-full',
                isCenterAligned ? 'justify-center text-center' : 'justify-start text-left',
              )}
            >
              <ItemDescription>{description}</ItemDescription>
            </div>
          ) : null}
          {children ? (
            <div
              className={cn(
                'flex w-full flex-col gap-4',
                isCenterAligned ? 'items-center text-center' : 'items-start text-left',
              )}
            >
              {children}
            </div>
          ) : null}
        </div>
      </ItemContent>
      {actions ? (
        <div
          className={cn(
            'flex w-full',
            isCenterAligned ? 'justify-center' : 'justify-start',
          )}
        >
          <ItemActions>{actions}</ItemActions>
        </div>
      ) : null}
    </Item>
  )
}
