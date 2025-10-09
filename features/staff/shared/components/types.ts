import type { DateRange } from 'react-day-picker'

export type StaffBreadcrumb = { label: string; href?: string }

export type StaffTab = {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  disabled?: boolean
}

export type StaffSummary = {
  id: string
  label: string
  value: string
  helper?: string
  icon?: React.ComponentType<{ className?: string }>
  tone?: 'default' | 'success' | 'warning' | 'info'
}

export type StaffQuickAction = {
  id: string
  label: string
  hint?: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export type StaffFilter = {
  id: string
  label: string
  description?: string
  defaultChecked?: boolean
}

export type StaffToggle = {
  id: string
  label: string
  helper?: string
  defaultOn?: boolean
}

export interface StaffPageShellProps {
  title: string
  description?: string
  breadcrumbs?: StaffBreadcrumb[]
  tabs?: StaffTab[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (value: string) => void
  summaries?: StaffSummary[]
  quickActions?: StaffQuickAction[]
  filters?: StaffFilter[]
  toggles?: StaffToggle[]
  avatarUrl?: string | null
  avatarFallback?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  dateRange?: DateRange | null
  onDateRangeChange?: (range: DateRange | null) => void
  children: React.ReactNode
  className?: string
  toolbarEnd?: React.ReactNode
}
