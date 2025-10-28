import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Item, ItemActions } from '@/components/ui/item'

interface RevokeAllDialogProps {
  otherSessionsCount: number
  revokingAll: boolean
  onRevokeAll: () => void
}

export function RevokeAllDialog({
  otherSessionsCount,
  revokingAll,
  onRevokeAll,
}: RevokeAllDialogProps) {
  if (otherSessionsCount === 0) return null

  return (
    <Item>
      <ItemActions>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={revokingAll}>
              {revokingAll ? (
                <>
                  <Spinner className="size-4" />
                  <span>Revoking all</span>
                </>
              ) : (
                <span>{`Revoke All Other Sessions (${otherSessionsCount})`}</span>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke All Other Sessions?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke all {otherSessionsCount} other session(s)? This will sign you out from all other devices.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={revokingAll}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  onClick={(event) => {
                    event.preventDefault()
                    onRevokeAll()
                  }}
                  disabled={revokingAll}
                >
                  {revokingAll ? (
                    <>
                      <Spinner className="size-4" />
                      <span>Revoking</span>
                    </>
                  ) : (
                    <span>Revoke All</span>
                  )}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  )
}
