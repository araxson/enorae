'use client'

import { useMemo, useState } from 'react'
import { Sparkles, SlidersHorizontal } from 'lucide-react'
import { StaffPageShell } from '@/features/staff/shared/components/staff-page-shell'
import type { StaffSummary, StaffQuickAction } from '@/features/staff/shared/components/types'
import { ServicesStats } from './services-stats'
import { ServicesFilters } from './services-filters'
import { ServiceCard } from './service-card'

type StaffService = {
  id: string
  service_name: string
  category_name?: string | null
  effective_duration?: number | null
  effective_price?: number | null
  proficiency_level?: string | null
  performed_count?: number | null
  rating_average?: number | null
  rating_count?: number | null
}

type ServicesClientProps = {
  services: StaffService[]
}

export function ServicesClient({ services }: ServicesClientProps) {
  const [activeTab, setActiveTab] = useState('catalog')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [proficiencyFilter, setProficiencyFilter] = useState('all')

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services.map((service) => service.category_name).filter((category): category is string => !!category)
    )
    return Array.from(uniqueCategories).sort()
  }, [services])

  const filteredServices = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase()

    return services.filter((service) => {
      const matchesSearch =
        !lowerQuery ||
        service.service_name.toLowerCase().includes(lowerQuery) ||
        service.category_name?.toLowerCase().includes(lowerQuery)

      const matchesCategory = categoryFilter === 'all' || service.category_name === categoryFilter
      const matchesProficiency = proficiencyFilter === 'all' || service.proficiency_level === proficiencyFilter

      return matchesSearch && matchesCategory && matchesProficiency
    })
  }, [services, searchQuery, categoryFilter, proficiencyFilter])

  const summaries: StaffSummary[] = [
    { id: 'total', label: 'Assigned services', value: services.length.toString(), helper: 'Active in your profile' },
    {
      id: 'performed',
      label: 'Delivered',
      value: services.reduce((acc, service) => acc + (service.performed_count || 0), 0).toString(),
      helper: 'Lifetime count',
      tone: 'info',
    },
    {
      id: 'favorites',
      label: 'Top rated',
      value: services.filter((service) => (service.rating_average || 0) >= 4.7).length.toString(),
      helper: 'Rated 4.7 or higher',
      tone: 'success',
    },
  ]

  const quickActions: StaffQuickAction[] = [
    { id: 'appointments', label: 'Upcoming appointments', href: '/staff/appointments' },
    { id: 'schedule', label: 'Open schedule', href: '/staff/schedule', icon: SlidersHorizontal },
    { id: 'commission', label: 'Commission insights', href: '/staff/commission', icon: Sparkles },
  ]

  if (services.length === 0) {
    return (
      <div className="space-y-6">
        <ServicesStats services={services} />
      </div>
    )
  }

  const tabs = [
    { value: 'catalog', label: 'Services', icon: Sparkles },
    { value: 'insights', label: 'Insights', icon: SlidersHorizontal },
  ]

  return (
    <StaffPageShell
      title="Service catalog"
      description="Understand your offering, track performance, and update proficiency."
      breadcrumbs={[
        { label: 'Staff', href: '/staff' },
        { label: 'Services' },
      ]}
      summaries={summaries}
      quickActions={quickActions}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchPlaceholder="Search services or categories…"
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      filters={[
        { id: 'category-filter', label: 'Filter by category', description: categoryFilter === 'all' ? 'Showing all categories' : categoryFilter },
      ]}
    >
      <div className="space-y-6">
        <ServicesFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          proficiencyFilter={proficiencyFilter}
          onProficiencyFilterChange={setProficiencyFilter}
          categories={categories}
          showSearch={false}
        />

        {activeTab === 'catalog' ? (
          filteredServices.length === 0 ? (
            <div className="rounded-lg border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              No services match your filters.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )
        ) : (
          <ServicesStats services={filteredServices} />
        )}
      </div>
    </StaffPageShell>
  )
}
