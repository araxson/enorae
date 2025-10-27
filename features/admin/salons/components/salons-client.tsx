'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AdminSalon, SalonDashboardStats, SalonInsights } from '@/features/admin/salons/api/queries'
import { SalonsStats } from './salons-stats'
import { SalonsFilters } from './salons-filters'
import { SalonsTable } from './salons-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

interface SalonsClientProps {
  salons: AdminSalon[]
  stats: SalonDashboardStats
  insights: SalonInsights
}

export function SalonsClient({ salons, stats, insights }: SalonsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'valid' | 'expiring' | 'expired' | 'unknown'>('all')
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const filteredSalons = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    const tierAliases: Record<string, string[]> = {
      basic: ['starter'],
      premium: ['professional'],
      enterprise: ['enterprise', 'custom'],
    }

    return salons.filter((salon) => {
      const matchesSearch =
        !normalizedQuery ||
        [salon['name'], salon.business_name, salon.slug]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery))

      const subscriptionTier = salon.subscriptionTier?.toLowerCase() ?? 'unassigned'
      const normalizedTierFilter = tierFilter.toLowerCase()
      const matchesTier =
        normalizedTierFilter === 'all' ||
        subscriptionTier === normalizedTierFilter ||
        tierAliases[normalizedTierFilter]?.includes(subscriptionTier) === true

      const matchesLicense = licenseFilter === 'all' || salon.licenseStatus === licenseFilter
      const matchesCompliance =
        complianceFilter === 'all' || salon.complianceLevel === complianceFilter

      return matchesSearch && matchesTier && matchesLicense && matchesCompliance
    })
  }, [salons, searchQuery, tierFilter, licenseFilter, complianceFilter])

  return (
    <div className="flex flex-col gap-10">
      <SalonsStats stats={stats} />

      <SalonsFilters
        search={searchQuery}
        onSearchChange={setSearchQuery}
        tierFilter={tierFilter}
        onTierChange={setTierFilter}
        licenseFilter={licenseFilter}
        onLicenseChange={setLicenseFilter}
        complianceFilter={complianceFilter}
        onComplianceChange={setComplianceFilter}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <InsightCard
          title="High risk compliance"
          subtitle="Salons that need immediate attention"
          items={insights.highRisk}
          renderBadge={(salon) => (
            <Badge variant="destructive">Score {salon.complianceScore}</Badge>
          )}
        />
        <InsightCard
          title="Expiring licenses"
          subtitle="Licenses expiring within 30 days"
          items={insights.expiring}
          renderBadge={(salon) => (
            <Badge variant="outline">
              {salon.licenseDaysRemaining !== null ? `${salon.licenseDaysRemaining} days` : 'Unknown'}
            </Badge>
          )}
        />
      </div>

      <SalonsTable salons={filteredSalons} />
    </div>
  )
}

type InsightCardProps = {
  title: string
  subtitle: string
  items: AdminSalon[]
  renderBadge: (salon: AdminSalon) => ReactNode
}

function InsightCard({ title, subtitle, items, renderBadge }: InsightCardProps) {
  return (
    <Card>
      <CardHeader>
        <ItemGroup>
          <Item variant="muted">
            <ItemContent>
              <CardTitle>{title}</CardTitle>
              <ItemDescription>{subtitle}</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No salons in this category</EmptyTitle>
              <EmptyDescription>Insights will fill once salons match the selected criteria.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          items.slice(0, 5).map((salon) => (
            <Item key={salon['id']} variant="outline" className="items-start gap-3">
              <ItemContent>
                <div className="min-w-0">
                  <ItemTitle>{salon['name'] || 'Unnamed salon'}</ItemTitle>
                  <ItemDescription>{salon.business_name || '—'}</ItemDescription>
                </div>
              </ItemContent>
              <ItemActions>{renderBadge(salon)}</ItemActions>
            </Item>
          ))
        )}
      </CardContent>
    </Card>
  )
}
