import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Command as CommandIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { StaffQuickAction } from './types'

interface StaffCommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quickActions?: readonly StaffQuickAction[]
}

export function StaffCommandDialog({ open, onOpenChange, quickActions }: StaffCommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader className="space-y-0 px-4 py-3">
          <DialogTitle>
            <span className="flex items-center gap-2 text-base">
              <CommandIcon className="h-4 w-4" />
              Quick navigator
            </span>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <Command className="rounded-b-lg">
          <CommandInput placeholder="Jump to a staff view or action…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Views">
              {quickActions?.map((action) => (
                <CommandItem key={`command-${action.id}`} value={action.href}>
                  {action.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Utilities">
              <CommandItem value="toggle-filters">Toggle filters</CommandItem>
              <CommandItem value="reset-range">Reset date range</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
