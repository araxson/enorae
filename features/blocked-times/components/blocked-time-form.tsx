'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBlockedTime } from '../actions/blocked-times.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack, Flex } from '@/components/layout'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { H3 } from '@/components/ui/typography'
import { AlertCircle } from 'lucide-react'

interface BlockedTimeFormProps {
  salonId: string
  staffId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function BlockedTimeForm({
  salonId,
  staffId,
  onSuccess,
  onCancel,
}: BlockedTimeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blockType, setBlockType] = useState<string>('manual')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const result = await createBlockedTime({
      salon_id: salonId,
      staff_id: staffId,
      block_type: formData.get('block_type') as string || 'manual',
      start_time: new Date(formData.get('start_time') as string).toISOString(),
      end_time: new Date(formData.get('end_time') as string).toISOString(),
      reason: formData.get('reason') as string,
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <H3>Block Time Slot</H3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Stack gap="md">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="block_type">Block Type</Label>
              <Select
                name="block_type"
                value={blockType}
                onValueChange={setBlockType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select block type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                name="start_time"
                type="datetime-local"
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                name="end_time"
                type="datetime-local"
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="e.g., Salon closed for maintenance"
                rows={3}
              />
            </div>
          </Stack>
        </CardContent>
        <CardFooter>
          <Flex justify="end" gap="sm">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Block Time'}
            </Button>
          </Flex>
        </CardFooter>
      </form>
    </Card>
  )
}
