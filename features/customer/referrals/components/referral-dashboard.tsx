'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Users, Gift, Copy, Mail, MessageSquare, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/lib/hooks/use-toast'
import { generateReferralCode } from '../api/mutations'
import type { Referral } from '../api/queries'

type Props = {
  referralCode: Referral | null
  stats: {
    total_referrals: number
    successful_referrals: number
    pending_referrals: number
    total_bonus_points: number
  }
  history: Referral[]
}

export function ReferralDashboard({ referralCode, stats, history }: Props) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleGenerateCode = async () => {
    setIsGenerating(true)
    try {
      const result = await generateReferralCode()
      if (result.success) {
        toast({
          title: 'Referral code generated',
          description: `Your code is: ${result.code}`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate referral code',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = () => {
    if (!referralCode) return

    navigator.clipboard.writeText(referralCode.code)
    setCopied(true)
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = referralCode
    ? `${window.location.origin}/signup?ref=${referralCode.code}`
    : ''

  const statCards = [
    {
      title: 'Total referrals',
      value: stats.total_referrals,
      description: 'Friends referred',
      icon: Users,
    },
    {
      title: 'Successful',
      value: stats.successful_referrals,
      description: 'Completed signups',
      icon: Check,
    },
    {
      title: 'Pending',
      value: stats.pending_referrals,
      description: 'Awaiting signup',
      icon: MessageSquare,
    },
    {
      title: 'Bonus points',
      value: stats.total_bonus_points,
      description: 'Points earned',
      icon: Gift,
    },
  ] as const

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="gap-2">
              <div className="flex items-center justify-between gap-3">
                <CardDescription>{card.title}</CardDescription>
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle>{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {referralCode ? (
              <>
                <div className="flex items-center gap-3">
                  <Input value={referralCode.code} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyCode}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <Alert>
                  <AlertTitle>Share your referral link</AlertTitle>
                  <AlertDescription>{shareUrl}</AlertDescription>
                </Alert>

                <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Share via SMS
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <CardDescription>How it works</CardDescription>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Share your unique referral code with friends</li>
                    <li>They sign up using your code</li>
                    <li>You both earn 100 bonus points!</li>
                    <li>Use points for discounts and rewards</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have a referral code yet
                </p>
                <Button onClick={handleGenerateCode} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Referral Code'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No referrals yet</p>
            ) : (
              history.map((referral) => (
                <div key={referral.id} className="flex gap-4 items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Referral Code: {referral.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(referral.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                    {referral.status === 'completed' ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
