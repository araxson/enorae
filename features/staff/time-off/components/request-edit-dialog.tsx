'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

interface RequestEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  startAt: string
  endAt: string
  requestType: string
  reason: string
  isPending: boolean
  onSave: (data: { startAt: string; endAt: string; requestType: string; reason: string }) => void
}

export function RequestEditDialog({
  open,
  onOpenChange,
  startAt,
  endAt,
  requestType,
  reason,
  isPending,
  onSave,
}: RequestEditDialogProps) {
  const [editData, setEditData] = useState({
    startAt,
    endAt,
    requestType,
    reason,
  })

  const handleSave = () => {
    onSave(editData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={isPending}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Time-Off Request</DialogTitle>
        </DialogHeader>
        <FieldSet className="space-y-4">
          <Field>
            <FieldLabel htmlFor="startAt">Start date</FieldLabel>
            <FieldContent>
              <Input
                id="startAt"
                type="date"
                value={editData.startAt}
                onChange={(e) => setEditData({ ...editData, startAt: e.target.value })}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="endAt">End date</FieldLabel>
            <FieldContent>
              <Input
                id="endAt"
                type="date"
                value={editData.endAt}
                onChange={(e) => setEditData({ ...editData, endAt: e.target.value })}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="requestType">Type</FieldLabel>
            <FieldContent>
              <Select
                value={editData.requestType}
                onValueChange={(value) => setEditData({ ...editData, requestType: value })}
              >
                <SelectTrigger id="requestType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick_leave">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="reason">Reason</FieldLabel>
            <FieldContent>
              <Textarea
                id="reason"
                value={editData.reason}
                onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                rows={3}
              />
            </FieldContent>
          </Field>
          <ButtonGroup className="justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              Save Changes
            </Button>
          </ButtonGroup>
        </FieldSet>
      </DialogContent>
    </Dialog>
  )
}
