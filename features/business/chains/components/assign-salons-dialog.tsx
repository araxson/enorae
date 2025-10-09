'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { assignSalonToChain } from '../api/mutations'

type AssignSalonsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  chainId: string
  chainName: string
  availableSalons: Array<{ id: string; name: string }>
}

export function AssignSalonsDialog({
  open,
  onOpenChange,
  chainId,
  chainName,
  availableSalons,
}: AssignSalonsDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSalonId, setSelectedSalonId] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedSalonId) {
      toast.error('Please select a salon')
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('salonId', selectedSalonId)
    formData.append('chainId', chainId)

    try {
      const result = await assignSalonToChain(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Salon assigned to chain successfully')
        onOpenChange(false)
        setSelectedSalonId('')
        router.refresh()
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Salon to Chain</DialogTitle>
          <DialogDescription>
            Add an existing salon to {chainName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salon">Select Salon</Label>
              <Select
                value={selectedSalonId}
                onValueChange={setSelectedSalonId}
              >
                <SelectTrigger id="salon">
                  <SelectValue placeholder="Choose a salon" />
                </SelectTrigger>
                <SelectContent>
                  {availableSalons.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No available salons
                    </div>
                  ) : (
                    availableSalons.map((salon) => (
                      <SelectItem key={salon.id} value={salon.id}>
                        {salon.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || availableSalons.length === 0}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Salon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
