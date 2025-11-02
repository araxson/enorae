'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemGroup } from '@/components/ui/item'

interface ProfileMetadataSubmitProps {
  isPending: boolean
  hasMetadata: boolean
  onReset: () => void
}

export function ProfileMetadataSubmit({
  isPending,
  hasMetadata,
  onReset,
}: ProfileMetadataSubmitProps) {
  return (
    <ItemGroup>
      <Item variant="muted">
        <ItemActions>
          <ButtonGroup>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Saving…
                </>
              ) : hasMetadata ? (
                'Update metadata'
              ) : (
                'Create metadata'
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onReset}
              disabled={isPending}
            >
              Reset
            </Button>
          </ButtonGroup>
        </ItemActions>
      </Item>
    </ItemGroup>
  )
}
