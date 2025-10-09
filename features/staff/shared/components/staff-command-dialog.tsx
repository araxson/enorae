import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import type { StaffQuickAction } from './types'

interface StaffCommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quickActions?: StaffQuickAction[]
}

export function StaffCommandDialog({ open, onOpenChange, quickActions }: StaffCommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader className="space-y-0 border-b px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <CommandIcon className="h-4 w-4" />
            Quick navigator
          </DialogTitle>
        </DialogHeader>
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

