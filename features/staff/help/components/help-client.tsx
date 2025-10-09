'use client'

import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import type { StaffQuickAction, StaffSummary } from '@/features/staff/shared/components/types'
import { StaffPageShell } from '@/features/staff/shared/components/staff-page-shell'
import { HelpResourceBrowser } from './help-resource-browser'
import { HelpLearningHubCard } from './help-learning-hub-card'
import { HelpCategoryAccordion } from './help-category-accordion'
import { HelpFeedbackDrawer } from './help-feedback-drawer'

type ResourceCategory = {
  id: string
  name: string
  description: string
}

type LearningTrack = {
  title: string
  duration: string
  level: string
  tags: string[]
}

interface StaffHelpClientProps {
  summaries: readonly StaffSummary[]
  quickActions: readonly StaffQuickAction[]
  resourceCategories: readonly ResourceCategory[]
  learningTracks: readonly LearningTrack[]
}

export function StaffHelpClient({
  summaries,
  quickActions,
  resourceCategories,
  learningTracks,
}: StaffHelpClientProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  return (
    <StaffPageShell
      title="Help Library"
      description="Browse curated resources, follow learning tracks, and keep your knowledge up to date."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Help' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      filters={[
        { id: 'favorites', label: 'Show favorites', defaultChecked: true },
        { id: 'updates', label: 'Recently updated', description: 'Within the last 30 days' },
      ]}
      toggles={[
        { id: 'reminders', label: 'Weekly reminder', helper: 'Email digest of saved content', defaultOn: false },
      ]}
      toolbarEnd={
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Save current view" onClick={() => setIsFeedbackOpen(true)}>
              <Bookmark className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Collect feedback & bookmarks</TooltipContent>
        </Tooltip>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
          <HelpResourceBrowser />
          <HelpLearningHubCard tracks={learningTracks} />
        </div>

        <HelpCategoryAccordion categories={resourceCategories} />
      </div>

      <HelpFeedbackDrawer open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
    </StaffPageShell>
  )
}

