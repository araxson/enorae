'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { bulkUpdateOperatingHours } from '../api/mutations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack, Flex, Grid } from '@/components/layout'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface OperatingHour {
  id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

interface WeeklyScheduleFormProps {
  salonId: string
  initialHours: OperatingHour[]
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function WeeklyScheduleForm({ salonId, initialHours }: WeeklyScheduleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize state with existing hours or defaults
  const [hours, setHours] = useState<
    Array<{
      day_of_week: number
      open_time: string
      close_time: string
      is_closed: boolean
    }>
  >(
    DAYS.map((_, index) => {
      const existing = initialHours.find((h) => h.day_of_week === index)
      return {
        day_of_week: index,
        open_time: existing?.open_time || '09:00',
        close_time: existing?.close_time || '17:00',
        is_closed: existing?.is_closed || false,
      }
    })
  )

  function updateDay(
    dayIndex: number,
    field: 'open_time' | 'close_time' | 'is_closed',
    value: string | boolean
  ) {
    setHours((prev) =>
      prev.map((h) => (h.day_of_week === dayIndex ? { ...h, [field]: value } : h))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await bulkUpdateOperatingHours(salonId, hours)

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      toast.error(result.error)
    } else {
      toast.success('Operating hours saved successfully!')
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Weekly Operating Hours</h3>
        <p className="leading-7 text-muted-foreground">
          Set your salon&apos;s operating hours for each day of the week
        </p>
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

            {DAYS.map((day, index) => {
              const dayHours = hours.find((h) => h.day_of_week === index)!
              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Grid cols={{ base: 1, md: 4 }} gap="md" className="items-end">
                      <div className="md:col-span-1">
                        <Label className="font-semibold">{day}</Label>
                      </div>

                      <div>
                        <Label htmlFor={`open-${index}`} className="text-sm">
                          Open Time
                        </Label>
                        <Input
                          id={`open-${index}`}
                          type="time"
                          value={dayHours.open_time}
                          onChange={(e) => updateDay(index, 'open_time', e.target.value)}
                          disabled={dayHours.is_closed}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`close-${index}`} className="text-sm">
                          Close Time
                        </Label>
                        <Input
                          id={`close-${index}`}
                          type="time"
                          value={dayHours.close_time}
                          onChange={(e) => updateDay(index, 'close_time', e.target.value)}
                          disabled={dayHours.is_closed}
                        />
                      </div>

                      <Flex gap="sm" align="center">
                        <Switch
                          id={`closed-${index}`}
                          checked={dayHours.is_closed}
                          onCheckedChange={(checked) =>
                            updateDay(index, 'is_closed', checked)
                          }
                        />
                        <Label htmlFor={`closed-${index}`}>
                          Closed
                        </Label>
                      </Flex>
                    </Grid>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </CardContent>
        <CardFooter>
          <Flex justify="end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Operating Hours'}
            </Button>
          </Flex>
        </CardFooter>
      </form>
    </Card>
  )
}
