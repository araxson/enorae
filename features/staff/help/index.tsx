import { StaffHelpClient } from './components/help-client'

const summaryCards = [
  { id: 'articles', label: 'Articles Saved', value: '12', helper: 'Across all categories', tone: 'info' },
  { id: 'searches', label: 'Search Sessions', value: '34', helper: 'Past 30 days', tone: 'default' },
  { id: 'feedback', label: 'Feedback Submitted', value: '5', helper: 'Thank you for improving docs', tone: 'success' },
  { id: 'watchlist', label: 'Followed Topics', value: '7', helper: 'You will be notified of updates', tone: 'warning' },
] as const

const quickActions = [
  { id: 'knowledge-base', label: 'Knowledge base', href: '#resource-browser' },
  { id: 'request-training', label: 'Request training', href: '#learning-hub' },
  { id: 'submit-feedback', label: 'Send feedback', href: '#feedback' },
] as const

const resourceCategories = [
  { id: 'orientation', name: 'Orientation', description: 'New team member essentials and orientation kits.' },
  { id: 'productivity', name: 'Productivity', description: 'Tips to accelerate daily workflows and collaboration.' },
  { id: 'escalations', name: 'Escalations', description: 'Guidance for handling urgent customer scenarios.' },
] as const

const learningTracks = [
  { title: 'Scheduling mastery', duration: '18 mins', level: 'Intermediate', tags: ['Calendar', 'Automation'] },
  { title: 'Client retention playbook', duration: '25 mins', level: 'Advanced', tags: ['Relationships', 'Growth'] },
  { title: 'Salon safety refresh', duration: '12 mins', level: 'Foundational', tags: ['Policy', 'Compliance'] },
] as const

export async function StaffHelp() {
  return (
    <StaffHelpClient
      summaries={summaryCards}
      quickActions={quickActions}
      resourceCategories={resourceCategories}
      learningTracks={learningTracks}
    />
  )
}

