'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Stack, Grid, Flex } from '@/components/layout'
import { Users, Gift, Copy, Mail, MessageSquare, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
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

  return (
    <Stack gap="xl">
      <Grid cols={{ base: 1, md: 4 }} gap="lg">
        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Total Referrals</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </Flex>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_referrals}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Friends referred
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Successful</CardTitle>
              <Check className="h-5 w-5 text-green-500" />
            </Flex>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.successful_referrals}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Completed signups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Pending</CardTitle>
              <MessageSquare className="h-5 w-5 text-yellow-500" />
            </Flex>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pending_referrals}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Awaiting signup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Flex justify="between" align="center">
              <CardTitle>Bonus Points</CardTitle>
              <Gift className="h-5 w-5 text-purple-500" />
            </Flex>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_bonus_points}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Points earned
            </p>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            {referralCode ? (
              <>
                <div className="flex items-center gap-3">
                  <Input
                    value={referralCode.code}
                    readOnly
                    className="font-mono text-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyCode}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-muted/30">
                  <p className="text-sm font-medium mb-2">Share your referral link:</p>
                  <p className="text-xs text-muted-foreground break-all">{shareUrl}</p>
                </div>

                <Grid cols={{ base: 1, md: 3 }} gap="sm">
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
                </Grid>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">How it works:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
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
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="sm">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No referrals yet</p>
            ) : (
              history.map((referral) => (
                <Flex key={referral.id} justify="between" align="center" className="border-b pb-3">
                  <div>
                    <p className="font-medium">Referral Code: {referral.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(referral.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                    {referral.status === 'completed' ? 'Completed' : 'Pending'}
                  </Badge>
                </Flex>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
