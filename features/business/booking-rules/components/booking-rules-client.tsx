'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center justify-between">
          <div>
            <p className="leading-7 text-sm text-muted-foreground">
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
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Timer className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="scroll-m-20 text-2xl font-semibold">No Booking Rules</h3>
              <p className="leading-7 text-muted-foreground text-center mt-2">
                Create booking rules to configure service durations, buffer times, and advance
                booking requirements
              </p>
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
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="scroll-m-20 text-2xl font-semibold text-lg">{rule.service?.name || 'Unknown Service'}</h3>
                      {rule.total_duration_minutes && (
                        <Badge variant="outline" className="mt-2">
                          Total: {rule.total_duration_minutes} min
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      {rule.duration_minutes !== null && rule.duration_minutes !== undefined && (
                        <div className="flex gap-3 items-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <small className="text-sm font-medium text-muted-foreground">Duration:</small>
                          <small className="text-sm font-medium font-medium">{rule.duration_minutes} min</small>
                        </div>
                      )}

                      {rule.buffer_minutes !== null && rule.buffer_minutes !== undefined && (
                        <div className="flex gap-3 items-center">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <small className="text-sm font-medium text-muted-foreground">Buffer:</small>
                          <small className="text-sm font-medium font-medium">{rule.buffer_minutes} min</small>
                        </div>
                      )}

                      {rule.min_advance_booking_hours !== null &&
                        rule.min_advance_booking_hours !== undefined && (
                          <div className="flex gap-3 items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <small className="text-sm font-medium text-muted-foreground">Min Advance:</small>
                            <small className="text-sm font-medium font-medium">
                              {rule.min_advance_booking_hours}h
                            </small>
                          </div>
                        )}

                      {rule.max_advance_booking_days !== null &&
                        rule.max_advance_booking_days !== undefined && (
                          <div className="flex gap-3 items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <small className="text-sm font-medium text-muted-foreground">Max Advance:</small>
                            <small className="text-sm font-medium font-medium">
                              {rule.max_advance_booking_days} days
                            </small>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
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
            <CardContent>
              <small className="text-sm font-medium text-muted-foreground">
                {servicesWithoutRules.length} service(s) without rules:{' '}
                {servicesWithoutRules.map((s) => s.name).join(', ')}
              </small>
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
