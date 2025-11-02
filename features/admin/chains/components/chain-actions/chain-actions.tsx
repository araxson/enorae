'use client'

import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle } from 'lucide-react'
import {
  verifyChain,
  updateChainActiveStatus,
  deleteChain,
} from '@/features/admin/chains/api/mutations'
import { ActionsDropdown } from './actions-dropdown'
import { ActionDialog } from './action-dialog'
import { validateReason } from './utils'
import type { ChainActionsProps, ChainActionType } from './types'

/**
 * Chain actions component
 *
 * Provides actions for chain management:
 * - Verify/unverify chain
 * - Activate/deactivate chain
 * - Delete chain
 *
 * All actions require a reason for audit trail
 */
export function ChainActions({
  chainId,
  chainName,
  isVerified,
  isActive,
}: ChainActionsProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [action, setAction] = useState<ChainActionType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)

  const handleAction = async () => {
    if (!action) return

    const validationError = validateReason(reason)
    if (validationError) {
      setReasonError(validationError)
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
        text: error instanceof Error ? error.message : 'Action failed',
      })
    } finally {
      setIsLoading(false)
      setShowDialog(false)
      setAction(null)
    }
  }

  const openDialog = (actionType: ChainActionType) => {
    setAction(actionType)
    setShowDialog(true)
    setReason('')
    setReasonError(null)
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
          <AlertTitle>
            {message.type === 'success' ? 'Action completed' : 'Action failed'}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <ActionsDropdown
        chainName={chainName}
        isVerified={isVerified}
        isActive={isActive}
        onActionSelect={openDialog}
      />

      <ActionDialog
        open={showDialog}
        action={action}
        chainName={chainName}
        reason={reason}
        reasonError={reasonError}
        isLoading={isLoading}
        onOpenChange={setShowDialog}
        onReasonChange={setReason}
        onConfirm={handleAction}
      />
    </>
  )
}
