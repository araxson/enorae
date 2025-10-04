'use client'

import { useState, useMemo } from 'react'
import { Scissors } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/layout'
import { P, Muted } from '@/components/ui/typography'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [proficiencyFilter, setProficiencyFilter] = useState('all')

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      services.map((s) => s.category_name).filter((c): c is string => !!c)
    )
    return Array.from(uniqueCategories).sort()
  }, [services])

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        !searchQuery ||
        service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category_name?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || service.category_name === categoryFilter

      const matchesProficiency =
        proficiencyFilter === 'all' || service.proficiency_level === proficiencyFilter

      return matchesSearch && matchesCategory && matchesProficiency
    })
  }, [services, searchQuery, categoryFilter, proficiencyFilter])

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Stack gap="md" className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Scissors className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <P className="font-medium">No Services Assigned</P>
              <Muted>Contact your salon manager to assign services to your profile</Muted>
            </div>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack gap="lg">
      <ServicesStats services={services} />

      <ServicesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        proficiencyFilter={proficiencyFilter}
        onProficiencyFilterChange={setProficiencyFilter}
        categories={categories}
      />

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <P className="text-center text-muted-foreground py-8">
              No services match your filters
            </P>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </Stack>
  )
}
