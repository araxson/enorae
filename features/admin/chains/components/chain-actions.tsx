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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MoreHorizontal, CheckCircle2, XCircle, Trash2, Power, PowerOff, CreditCard } from 'lucide-react'
import { verifyChain, updateChainActiveStatus, updateChainSubscription, deleteChain } from '../api/mutations'

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

  const handleAction = async () => {
    if (!action) return

    setIsLoading(true)
    setMessage(null)

    try {
      let result

      switch (action) {
        case 'verify':
          result = await verifyChain({ chainId, isVerified: true })
          break
        case 'unverify':
          result = await verifyChain({ chainId, isVerified: false })
          break
        case 'activate':
          result = await updateChainActiveStatus({ chainId, isActive: true })
          break
        case 'deactivate':
          result = await updateChainActiveStatus({ chainId, isActive: false })
          break
        case 'delete':
          result = await deleteChain({ chainId, reason: 'Admin action' })
          break
      }

      setMessage({ type: 'success', text: result?.message || 'Action completed successfully' })
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
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isVerified ? (
            <DropdownMenuItem onClick={() => openDialog('verify')}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verify Chain
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => openDialog('unverify')}>
              <XCircle className="mr-2 h-4 w-4" />
              Unverify Chain
            </DropdownMenuItem>
          )}

          {isActive ? (
            <DropdownMenuItem onClick={() => openDialog('deactivate')}>
              <PowerOff className="mr-2 h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => openDialog('activate')}>
              <Power className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => openDialog('delete')} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Chain
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getActionText().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionText().description}
              <br />
              <strong className="mt-2 block">Chain: {chainName}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
