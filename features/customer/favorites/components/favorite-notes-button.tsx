'use client'

import { useState, useCallback, memo } from 'react'
import { StickyNote } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toggleFavorite } from '@/features/customer/favorites/api/mutations'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'

interface FavoriteNotesButtonProps {
  salonId: string
  salonName: string
  initialNotes?: string | null
}

export const FavoriteNotesButton = memo(function FavoriteNotesButton({ salonId, salonName, initialNotes }: FavoriteNotesButtonProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(initialNotes || '')
  const [loading, setLoading] = useState(false)

  const handleSave = useCallback(async () => {
    setLoading(true)
    const result = await toggleFavorite(salonId, notes)

    if (!result.success) {
      toast.error(result.error)
    } else {
      toast.success('Notes saved successfully')
      setOpen(false)
    }

    setLoading(false)
  }, [salonId, notes])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon" variant={initialNotes ? 'default' : 'outline'}>
                <StickyNote className="size-4" />
                <span className="sr-only">{initialNotes ? 'Edit notes' : 'Add notes'}</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{initialNotes ? 'Edit your notes' : 'Add personal notes'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Personal Notes</DialogTitle>
          <DialogDescription>
            Add your personal notes about {salonName}. These are private and only visible to you.
          </DialogDescription>
        </DialogHeader>

        <FieldSet className="space-y-2">
          <Field>
            <FieldLabel htmlFor="notes">Your notes</FieldLabel>
            <FieldContent>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Great haircut, ask for Sarah, bring photo next time..."
                maxLength={500}
                rows={6}
              />
            </FieldContent>
            <FieldDescription>
              <span className="text-xs">{notes.length}/500 characters</span>
            </FieldDescription>
          </Field>
        </FieldSet>

        <DialogFooter>
          <ButtonGroup aria-label="Actions">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Notes</span>
              )}
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
