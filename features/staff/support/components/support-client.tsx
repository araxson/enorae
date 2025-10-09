'use client'

import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Bell, LifeBuoy } from 'lucide-react'
import type { StaffQuickAction, StaffSummary } from '@/features/staff/shared/components/types'
import { StaffPageShell } from '@/features/staff/shared/components/staff-page-shell'
import { SupportGuidesCard } from './support-guides-card'
import { SupportContactCard } from './support-contact-card'
import { SupportTicketCard } from './support-ticket-card'
import { SupportFaqCard } from './support-faq-card'
import { SupportContactSheet } from './support-contact-sheet'

type GuideSection = {
  id: string
  title: string
  description: string
}

type FaqItem = {
  question: string
  answer: string
}

interface StaffSupportClientProps {
  summaries: readonly StaffSummary[]
  quickActions: readonly StaffQuickAction[]
  guideSections: readonly GuideSection[]
  faqItems: readonly FaqItem[]
}

export function StaffSupportClient({
  summaries,
  quickActions,
  guideSections,
  faqItems,
}: StaffSupportClientProps) {
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false)

  return (
    <StaffPageShell
      title="Support Center"
      description="Access tailored guidance, open support tickets, and review the latest operational updates."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Support' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      filters={[
        { id: 'urgent', label: 'Show urgent only', defaultChecked: false },
        { id: 'recent', label: 'Only recent updates', description: 'Items from the past 14 days' },
      ]}
      toggles={[
        {
          id: 'notifications',
          label: 'Email notifications',
          helper: 'Send a summary after resolution',
          defaultOn: true,
        },
      ]}
      toolbarEnd={
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open contact drawer"
              onClick={() => setIsContactSheetOpen(true)}
            >
              <LifeBuoy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open contact options</TooltipContent>
        </Tooltip>
      }
    >
      <div className="space-y-6">
        <Alert variant="warning">
          <Bell className="h-4 w-4" />
          <AlertTitle>System note</AlertTitle>
          <AlertDescription>
            Calendar sync delays are impacting confirmations. Our infrastructure team is rolling out a fix and will update you here.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <SupportGuidesCard sections={guideSections} />
          <SupportContactCard onOpenContact={() => setIsContactSheetOpen(true)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2" id="new-ticket">
          <SupportTicketCard />
          <SupportFaqCard items={faqItems} />
        </div>
      </div>

      <SupportContactSheet open={isContactSheetOpen} onOpenChange={setIsContactSheetOpen} />
    </StaffPageShell>
  )
}

