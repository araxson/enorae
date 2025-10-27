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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react'
import { updateChainSubscription } from '@/features/admin/chains/api/mutations'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

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
        <ItemGroup>
          <Item variant="muted">
            <ItemMedia variant="icon">
              <CreditCard className="h-5 w-5" />
            </ItemMedia>
            <ItemContent>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>{chainName}</CardDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{message.type === 'success' ? 'Subscription updated' : 'Update failed'}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <ItemGroup className="gap-2">
          <Item>
            <ItemContent>
              <ItemTitle>Current tier</ItemTitle>
              {currentTierInfo?.description ? (
                <ItemDescription>{currentTierInfo.description}</ItemDescription>
              ) : null}
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">{currentTierInfo?.label || 'Free'}</Badge>
            </ItemActions>
          </Item>
        </ItemGroup>

        <FieldGroup className="space-y-4">
          <Field>
            <FieldLabel>Update Subscription Tier</FieldLabel>
            <FieldContent>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_TIERS.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{tier.label}</span>
                        <CardDescription>{tier.description}</CardDescription>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="subscription-reason">Reason (optional)</FieldLabel>
            <FieldContent>
              <Textarea
                id="subscription-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Add context for this change (optional, max 500 characters)"
                rows={3}
              />
              <FieldDescription>Helps audit why subscription tiers change.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>

        <ButtonGroup className="w-full justify-end">
          <Button
            onClick={handleUpdateSubscription}
            disabled={isLoading || selectedTier === currentTier}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="size-4" />
                <span>Updating…</span>
              </>
            ) : (
              <span>Update Subscription</span>
            )}
          </Button>
        </ButtonGroup>

        <Alert>
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            Subscription changes take effect immediately. Chains will be notified of any tier changes.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
