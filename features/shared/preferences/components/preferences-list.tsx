'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Edit2, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteUserPreference } from '@/features/shared/preferences/api/mutations'
import type { Database } from '@/lib/types/database.types'

type ProfilePreference = Database['identity']['Tables']['profiles_preferences']['Row']

type PreferencesListProps = {
  preferences: ProfilePreference[]
  onEdit?: (pref: ProfilePreference) => void
}

export function PreferencesList({ preferences, onEdit }: PreferencesListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    const formData = new FormData()
    formData.append('id', deleteId)

    try {
      const result = await deleteUserPreference(formData)
      if (result.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error('Failed to delete preference')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (preferences.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Settings className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>No preferences configured</EmptyTitle>
              <EmptyDescription>
                Update your profile preferences to tailor notifications and locale settings.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {preferences.map((pref) => (
            <TableRow key={pref.id}>
              <TableCell>
                <code className="text-sm font-mono">{pref.locale || 'en-US'}</code>
              </TableCell>
              <TableCell className="max-w-72">
                <div className="truncate text-sm">{pref.timezone || 'UTC'}</div>
              </TableCell>
              <TableCell className="max-w-52">
                <div className="truncate text-sm text-muted-foreground">
                  {pref.currency_code || 'USD'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <ButtonGroup className="ml-auto justify-end">
                  {onEdit ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pref)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(pref.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preference</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this preference? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
