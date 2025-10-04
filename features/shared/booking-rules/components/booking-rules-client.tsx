'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack, Grid, Flex } from '@/components/layout'
import { H3, P, Small } from '@/components/ui/typography'
import { Plus, Clock, Calendar, Timer } from 'lucide-react'
import { BookingRuleForm } from './booking-rule-form'
import type { BookingRuleWithService } from '../api/queries'

interface BookingRulesClientProps {
  rules: BookingRuleWithService[]
  services: Array<{ id: string; name: string }>
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
}

export function BookingRulesClient({ rules, services, onSubmit }: BookingRulesClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<BookingRuleWithService | null>(null)

  const servicesWithoutRules = services.filter(
    (service) => !rules.some((rule) => rule.service_id === service.id)
  )

  function handleEdit(rule: BookingRuleWithService) {
    setSelectedRule(rule)
    setIsFormOpen(true)
  }

  function handleCreate() {
    setSelectedRule(null)
    setIsFormOpen(true)
  }

  function handleClose() {
    setIsFormOpen(false)
    setSelectedRule(null)
  }

  return (
    <>
      <Stack gap="lg">
        <Flex justify="between" align="center">
          <div>
            <P className="text-sm text-muted-foreground">
              {rules.length} {rules.length === 1 ? 'rule' : 'rules'} configured
            </P>
          </div>
          <Button onClick={handleCreate} disabled={servicesWithoutRules.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </Flex>

        {rules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Timer className="h-12 w-12 text-muted-foreground mb-4" />
              <H3>No Booking Rules</H3>
              <P className="text-muted-foreground text-center mt-2">
                Create booking rules to configure service durations, buffer times, and advance
                booking requirements
              </P>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
            {rules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Stack gap="md">
                    <div>
                      <H3 className="text-lg">{rule.service?.name || 'Unknown Service'}</H3>
                      {rule.total_duration_minutes && (
                        <Badge variant="outline" className="mt-2">
                          Total: {rule.total_duration_minutes} min
                        </Badge>
                      )}
                    </div>

                    <Stack gap="sm">
                      {rule.duration_minutes !== null && rule.duration_minutes !== undefined && (
                        <Flex gap="sm" align="center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Small className="text-muted-foreground">Duration:</Small>
                          <Small className="font-medium">{rule.duration_minutes} min</Small>
                        </Flex>
                      )}

                      {rule.buffer_minutes !== null && rule.buffer_minutes !== undefined && (
                        <Flex gap="sm" align="center">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <Small className="text-muted-foreground">Buffer:</Small>
                          <Small className="font-medium">{rule.buffer_minutes} min</Small>
                        </Flex>
                      )}

                      {rule.min_advance_booking_hours !== null &&
                        rule.min_advance_booking_hours !== undefined && (
                          <Flex gap="sm" align="center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Small className="text-muted-foreground">Min Advance:</Small>
                            <Small className="font-medium">
                              {rule.min_advance_booking_hours}h
                            </Small>
                          </Flex>
                        )}

                      {rule.max_advance_booking_days !== null &&
                        rule.max_advance_booking_days !== undefined && (
                          <Flex gap="sm" align="center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Small className="text-muted-foreground">Max Advance:</Small>
                            <Small className="font-medium">
                              {rule.max_advance_booking_days} days
                            </Small>
                          </Flex>
                        )}
                    </Stack>
                  </Stack>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(rule)} className="w-full">
                    Edit Rule
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        )}

        {servicesWithoutRules.length > 0 && rules.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <Small className="text-muted-foreground">
                {servicesWithoutRules.length} service(s) without rules:{' '}
                {servicesWithoutRules.map((s) => s.name).join(', ')}
              </Small>
            </CardContent>
          </Card>
        )}
      </Stack>

      <BookingRuleForm
        open={isFormOpen}
        onOpenChange={handleClose}
        rule={selectedRule}
        services={servicesWithoutRules}
        onSubmit={onSubmit}
      />
    </>
  )
}
