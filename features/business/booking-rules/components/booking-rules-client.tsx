'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Clock, Calendar, Timer } from 'lucide-react'
import { BookingRuleForm } from './booking-rule-form'
import type { BookingRuleWithService } from '@/features/business/booking-rules/api/queries'

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
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {rules.length} {rules.length === 1 ? 'rule' : 'rules'} configured
            </p>
          </div>
          <Button onClick={handleCreate} disabled={servicesWithoutRules.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>

        {rules.length === 0 ? (
          <Card>
            <CardHeader className="items-center justify-center">
              <CardTitle>No Booking Rules</CardTitle>
              <CardDescription>
                Configure service durations, buffers, and advance notice requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <Timer className="h-12 w-12 text-muted-foreground mb-4" />
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <CardTitle>{rule.service?.name || 'Unknown Service'}</CardTitle>
                  {rule.total_duration_minutes ? (
                    <CardDescription>Total {rule.total_duration_minutes} minutes</CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-0">
                  <div className="flex flex-col gap-3">
                    {rule.duration_minutes !== null && rule.duration_minutes !== undefined && (
                      <div className="flex gap-3 items-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Duration:</p>
                        <p>{rule.duration_minutes} min</p>
                        </div>
                      )}

                      {rule.buffer_minutes !== null && rule.buffer_minutes !== undefined && (
                        <div className="flex gap-3 items-center">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Buffer:</p>
                          <p>{rule.buffer_minutes} min</p>
                        </div>
                      )}

                      {rule.min_advance_booking_hours !== null &&
                        rule.min_advance_booking_hours !== undefined && (
                          <div className="flex gap-3 items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-muted-foreground">Min Advance:</p>
                            <p>
                              {rule.min_advance_booking_hours}h
                            </p>
                          </div>
                        )}

                      {rule.max_advance_booking_days !== null &&
                        rule.max_advance_booking_days !== undefined && (
                          <div className="flex gap-3 items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-muted-foreground">Max Advance:</p>
                            <p>
                              {rule.max_advance_booking_days} days
                            </p>
                          </div>
                        )}
                    </div>
                </CardContent>
                <Separator className="mt-2" />
                <CardFooter className="p-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(rule)} className="w-full">
                    Edit Rule
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {servicesWithoutRules.length > 0 && rules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Services Without Rules</CardTitle>
              <CardDescription>
                {servicesWithoutRules.length} service(s) missing configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">
                {servicesWithoutRules.map((s) => s.name).join(', ')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

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
