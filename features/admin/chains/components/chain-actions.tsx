'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { MoreHorizontal, CheckCircle2, XCircle, Trash2, Power, PowerOff, CreditCard } from 'lucide-react'
import { verifyChain, updateChainActiveStatus, updateChainSubscription, deleteChain } from '@/features/admin/chains/api/mutations'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

interface ChainActionsProps {
  chainId: string
  chainName: string
  isVerified: boolean
  isActive: boolean
  subscriptionTier: string | null
}

export function ChainActions({ chainId, chainName, isVerified, isActive, subscriptionTier }: ChainActionsProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [action, setAction] = useState<'verify' | 'unverify' | 'activate' | 'deactivate' | 'delete' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)

  const handleAction = async () => {
    if (!action) return

    if (reason.trim().length < 10) {
      setReasonError('Please provide a reason with at least 10 characters.')
      return
    }

    setIsLoading(true)
    setMessage(null)
    setReasonError(null)

    try {
      let result

      switch (action) {
        case 'verify':
          result = await verifyChain({ chainId, isVerified: true, reason })
          break
        case 'unverify':
          result = await verifyChain({ chainId, isVerified: false, reason })
          break
        case 'activate':
          result = await updateChainActiveStatus({ chainId, isActive: true, reason })
          break
        case 'deactivate':
          result = await updateChainActiveStatus({ chainId, isActive: false, reason })
          break
        case 'delete':
          result = await deleteChain({ chainId, reason })
          break
        default:
          result = null
      }

      if (result && 'error' in result && result.error) {
        setMessage({ type: 'error', text: result.error })
      } else if (result && 'message' in result) {
        setMessage({ type: 'success', text: result.message })
        setReason('')
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Action failed'
      })
    } finally {
      setIsLoading(false)
      setShowDialog(false)
      setAction(null)
    }
  }

  const openDialog = (actionType: typeof action) => {
    setAction(actionType)
    setShowDialog(true)
    setReason('')
    setReasonError(null)
  }

  const getActionText = () => {
    switch (action) {
      case 'verify':
        return { title: 'Verify Chain', description: 'This will mark the chain as verified.' }
      case 'unverify':
        return { title: 'Unverify Chain', description: 'This will mark the chain as unverified.' }
      case 'activate':
        return { title: 'Activate Chain', description: 'This will activate the chain and all its salons.' }
      case 'deactivate':
        return { title: 'Deactivate Chain', description: 'This will deactivate the chain and all its salons.' }
      case 'delete':
        return { title: 'Delete Chain', description: 'This will permanently delete the chain. This action cannot be undone.' }
      default:
        return { title: '', description: '' }
    }
  }

  return (
    <>
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
          {message.type === 'success' ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <XCircle className="size-4" />
          )}
          <AlertTitle>{message.type === 'success' ? 'Action completed' : 'Action failed'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" aria-label={`Open actions for ${chainName}`}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isVerified ? (
            <DropdownMenuItem onClick={() => openDialog('verify')}>
              <CheckCircle2 className="mr-2 size-4" />
              Verify Chain
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => openDialog('unverify')}>
              <XCircle className="mr-2 size-4" />
              Unverify Chain
            </DropdownMenuItem>
          )}

          {isActive ? (
            <DropdownMenuItem onClick={() => openDialog('deactivate')}>
              <PowerOff className="mr-2 size-4" />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => openDialog('activate')}>
              <Power className="mr-2 size-4" />
              Activate
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => openDialog('delete')}>
            <Trash2 className="mr-2 size-4" />
            Delete Chain
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getActionText().title}</AlertDialogTitle>
            <AlertDialogDescription>{getActionText().description}</AlertDialogDescription>
            <AlertDialogDescription>Chain: {chainName}</AlertDialogDescription>
          </AlertDialogHeader>
          <Field data-invalid={Boolean(reasonError)}>
            <FieldLabel htmlFor="chain-reason">Reason (required)</FieldLabel>
            <FieldContent>
              <Textarea
                id="chain-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Provide context for this action (minimum 10 characters)"
                aria-invalid={Boolean(reasonError)}
                autoFocus
                rows={4}
              />
              <FieldDescription>Provide at least 10 characters to explain the action.</FieldDescription>
            </FieldContent>
            {reasonError ? <FieldError>{reasonError}</FieldError> : null}
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  <span>Processing…</span>
                </>
              ) : (
                <span>Confirm</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
