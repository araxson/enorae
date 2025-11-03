import type { LucideIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

export interface StaffCommonState {}

export interface StaffCommonParams {}

export interface StaffQuickAction {
  id: string
  label: string
  href: string
  icon?: LucideIcon
}

export interface StaffFilter {
  id: string
  label: string
  description?: string
  defaultChecked?: boolean
}

export interface StaffToggle {
  id: string
  label: string
  helper?: string
  defaultOn?: boolean
}

export interface StaffBreadcrumb {
  label: string
  href?: string
}

export interface StaffTab {
  value: string
  label: string
  icon?: LucideIcon
  badge?: string | number
  disabled?: boolean
}

export interface StaffSummary {
  id: string
  label: string
  value: string | number
  helper?: string
  icon?: LucideIcon
  tone?: 'default' | 'success' | 'warning' | 'info'
}

export interface StaffPageShellProps {
  title: string
  description?: string
  breadcrumbs?: readonly StaffBreadcrumb[]
  tabs?: readonly StaffTab[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (value: string) => void
  summaries?: readonly StaffSummary[]
  quickActions?: readonly StaffQuickAction[]
  filters?: readonly StaffFilter[]
  toggles?: readonly StaffToggle[]
  avatarUrl?: string | null
  avatarFallback?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  dateRange?: DateRange | null
  onDateRangeChange?: (range: DateRange | null) => void
  children?: React.ReactNode
  className?: string
  toolbarEnd?: React.ReactNode
}
