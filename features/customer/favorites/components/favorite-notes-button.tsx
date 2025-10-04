'use client'

import { useState } from 'react'
import { StickyNote, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
import { toggleFavorite } from '../api/mutations'

interface FavoriteNotesButtonProps {
  salonId: string
  salonName: string
  initialNotes?: string | null
}

export function FavoriteNotesButton({ salonId, salonName, initialNotes }: FavoriteNotesButtonProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(initialNotes || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const result = await toggleFavorite(salonId, notes)

    if (result.error) {
      toast.error(result.error)
    } else if (result.success) {
      toast.success('Notes saved successfully')
      setOpen(false)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon" variant={initialNotes ? 'default' : 'outline'}>
                <StickyNote className={initialNotes ? 'h-4 w-4' : 'h-4 w-4'} />
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

        <div className="space-y-2">
          <Label htmlFor="notes">Your Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Great haircut, ask for Sarah, bring photo next time..."
            maxLength={500}
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            {notes.length}/500 characters
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
