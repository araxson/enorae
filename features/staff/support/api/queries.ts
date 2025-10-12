import 'server-only'

const summaryCards = [
  { id: 'open', label: 'Open Tickets', value: '2', helper: '1 urgent response pending', tone: 'warning' },
  { id: 'avg-response', label: 'Avg Response Time', value: '1h 42m', helper: 'Across the last 7 days', tone: 'info' },
  { id: 'kb-reads', label: 'Guide Reads', value: '18', helper: 'Team activity this week', tone: 'default' },
  { id: 'satisfaction', label: 'Satisfaction', value: '96%', helper: 'After resolved tickets', tone: 'success' },
] as const

const quickActions = [
  { id: 'new-ticket', label: 'New ticket', href: '#new-ticket' },
  { id: 'contact', label: 'Contact support', href: '#contact-options' },
  { id: 'release-notes', label: 'Release notes', href: '#release-notes' },
] as const

const guideSections = [
  {
    id: 'appointments',
    title: 'Appointments & Scheduling',
    description: 'Resolve booking, calendar sync, and reminder issues.',
  },
  {
    id: 'customers',
    title: 'Client Relationships',
    description: 'Guidance on managing client records and follow-ups.',
  },
  {
    id: 'profile',
    title: 'Profile & Preferences',
    description: 'Keep your availability and personal details up to date.',
  },
] as const

const faqItems = [
  {
    question: 'How quickly will support respond to urgent tickets?',
    answer:
      'Urgent tickets are triaged within 30 minutes during staffed hours. You will receive both an email and in-app notification when an expert is assigned.',
  },
  {
    question: 'Can I reopen a resolved ticket?',
    answer:
      'Yes. Open the ticket history in the support timeline, then choose “Reopen ticket”. Provide a short update so the specialist knows what changed.',
  },
  {
    question: 'Where can I learn about the latest feature updates?',
    answer:
      'Visit the Release Notes tab below for condensed highlights, or subscribe to the changelog RSS feed inside the same tab.',
  },
] as const

export async function getStaffSupportOverview() {
  return {
    summaryCards,
    quickActions,
    guideSections,
    faqItems,
  }
}