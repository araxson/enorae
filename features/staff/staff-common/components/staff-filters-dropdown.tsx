import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Filter } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import type { StaffFilter, StaffToggle } from './types'

interface StaffFiltersDropdownProps {
  filters?: readonly StaffFilter[]
  toggles?: readonly StaffToggle[]
}

export function StaffFiltersDropdown({ filters, toggles }: StaffFiltersDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Display options">
          <Filter className="size-4" aria-hidden="true" />
          <span className="sr-only">Display options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>Display options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filters && filters.length > 0 ? (
          <div className="space-y-2 px-2 py-1.5">
            {filters.map((filter) => {
              const labelId = `${filter.id}-label`
              return (
                <Item key={filter.id} className="items-start gap-3">
                  <ItemActions className="flex-none pt-1">
                    <Checkbox
                      id={filter.id}
                      defaultChecked={filter.defaultChecked}
                      aria-labelledby={labelId}
                    />
                  </ItemActions>
                  <ItemContent>
                    <ItemTitle id={labelId}>{filter.label}</ItemTitle>
                    {filter.description ? (
                      <ItemDescription>{filter.description}</ItemDescription>
                    ) : null}
                  </ItemContent>
                </Item>
              )
            })}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No quick filters available</EmptyTitle>
              <EmptyDescription>Adjust settings to add frequently used filters.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {toggles && toggles.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <div className="space-y-3 px-2 py-1.5">
              {toggles.map((toggle) => (
                <div key={toggle.id} className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{toggle.label}</span>
                    {toggle.helper ? (
                      <span className="text-xs text-muted-foreground">{toggle.helper}</span>
                    ) : null}
                  </div>
                  <Switch defaultChecked={toggle.defaultOn} />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
