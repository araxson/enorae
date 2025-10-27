'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Clock, Calendar, Timer } from 'lucide-react'
import { BookingRuleForm } from './booking-rule-form'
import type { BookingRuleWithService } from '@/features/business/booking-rules/api/queries'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ButtonGroup } from '@/components/ui/button-group'

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
          <ButtonGroup>
            <Button onClick={handleCreate} disabled={servicesWithoutRules.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </ButtonGroup>
        </div>

        {rules.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Timer className="h-8 w-8" aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No booking rules</EmptyTitle>
              <EmptyDescription>
                Configure service durations, buffers, and advance notice requirements.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <ButtonGroup>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
              </ButtonGroup>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => (
              <Item key={rule.id} variant="outline" className="flex flex-col gap-3">
                <ItemHeader>
                  <ItemTitle>{rule.service?.name || 'Unknown Service'}</ItemTitle>
                  {rule.total_duration_minutes ? (
                    <ItemDescription>Total {rule.total_duration_minutes} minutes</ItemDescription>
                  ) : null}
                </ItemHeader>
                <ItemContent>
                  <div className="flex flex-col gap-3">
                    {rule.duration_minutes !== null && rule.duration_minutes !== undefined ? (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{rule.duration_minutes} min</span>
                      </div>
                    ) : null}

                    {rule.buffer_minutes !== null && rule.buffer_minutes !== undefined ? (
                      <div className="flex items-center gap-3">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Buffer:</span>
                        <span>{rule.buffer_minutes} min</span>
                      </div>
                    ) : null}

                    {rule.min_advance_booking_hours !== null && rule.min_advance_booking_hours !== undefined ? (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Min Advance:</span>
                        <span>{rule.min_advance_booking_hours}h</span>
                      </div>
                    ) : null}

                    {rule.max_advance_booking_days !== null && rule.max_advance_booking_days !== undefined ? (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Max Advance:</span>
                        <span>{rule.max_advance_booking_days} days</span>
                      </div>
                    ) : null}
                  </div>
                </ItemContent>
                <ItemActions>
                  <ButtonGroup className="w-full">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(rule)} className="w-full">
                      Edit Rule
                    </Button>
                  </ButtonGroup>
                </ItemActions>
              </Item>
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
