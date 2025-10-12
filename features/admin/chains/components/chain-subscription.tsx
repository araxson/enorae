'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react'
import { updateChainSubscription } from '../api/mutations'
import { Textarea } from '@/components/ui/textarea'

interface ChainSubscriptionProps {
  chainId: string
  chainName: string
  currentTier: string | null
}

const SUBSCRIPTION_TIERS = [
  { value: 'free', label: 'Free', description: 'Basic features' },
  { value: 'starter', label: 'Starter', description: 'Up to 3 salons' },
  { value: 'professional', label: 'Professional', description: 'Up to 10 salons' },
  { value: 'enterprise', label: 'Enterprise', description: 'Unlimited salons' },
]

export function ChainSubscription({ chainId, chainName, currentTier }: ChainSubscriptionProps) {
  const [selectedTier, setSelectedTier] = useState(currentTier || 'free')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [reason, setReason] = useState('')

  const handleUpdateSubscription = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await updateChainSubscription({ chainId, subscriptionTier: selectedTier, reason })
      if ('error' in result) {
        throw new Error(result.error)
      }
      setMessage({ type: 'success', text: result.message })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update subscription'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const currentTierInfo = SUBSCRIPTION_TIERS.find(t => t.value === (currentTier || 'free'))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>Subscription Management</CardTitle>
        </div>
        <CardDescription>{chainName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Tier:</span>
            <Badge variant="outline" className="capitalize">
              {currentTierInfo?.label || 'Free'}
            </Badge>
          </div>
          {currentTierInfo?.description && (
            <p className="text-sm text-muted-foreground">{currentTierInfo.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Update Subscription Tier</label>
          <Select value={selectedTier} onValueChange={setSelectedTier}>
            <SelectTrigger>
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              {SUBSCRIPTION_TIERS.map((tier) => (
                <SelectItem key={tier.value} value={tier.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{tier.label}</span>
                    <span className="text-xs text-muted-foreground">{tier.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="subscription-reason">
            Reason (optional)
          </label>
          <Textarea
            id="subscription-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Add context for this change (optional, max 500 characters)"
          />
        </div>

        <Button
          onClick={handleUpdateSubscription}
          disabled={isLoading || selectedTier === currentTier}
          className="w-full"
        >
          {isLoading ? 'Updating...' : 'Update Subscription'}
        </Button>

        <div className="rounded-lg bg-muted p-4 text-sm">
          <h4 className="font-medium mb-2">Note:</h4>
          <p className="text-muted-foreground">
            Subscription changes take effect immediately. Chains will be notified of any tier changes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
