'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Building2, Users } from 'lucide-react'
import type { EnhancedSalon } from '../api/queries'
import { COMPLIANCE_BADGE_VARIANT, LICENSE_BADGE_VARIANT } from '@/features/admin/admin-common/constants/badge-variants'
import { DataTableEmpty } from '@/components/shared/data-table-empty'

interface SalonsTableProps {
  salons: EnhancedSalon[]
}

export function SalonsTable({ salons }: SalonsTableProps) {
  if (salons.length === 0) {
    return (
      <DataTableEmpty
        icon={Building2}
        title="No salons found"
        description="When salons join the platform, their profiles and metrics will appear here."
      />
    )
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Salon</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salons.map((salon) => (
              <TableRow key={salon.id} className="hover:bg-accent/50">
                <TableCell>
                  <div className="min-w-[200px]">
                    <p className="font-medium">{salon.name}</p>
                    {salon.chain_name && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        {salon.chain_name}
                      </p>
                    )}
                    {salon.owner_name && (
                      <p className="text-xs text-muted-foreground">{salon.owner_name}</p>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-sm capitalize">{salon.business_type || 'salon'}</TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {salon.rating_average ? salon.rating_average.toFixed(1) : 'N/A'}
                    </span>
                    {salon.rating_count && (
                      <span className="text-xs text-muted-foreground">{salon.rating_count} reviews</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-sm font-medium">
                  {salon.total_revenue ? `$${Number(salon.total_revenue).toLocaleString()}` : '$0'}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{salon.employee_count || 0}</span>
                  </div>
                  {salon.staffCapacityRatio > 1 && (
                    <span className="text-xs text-destructive">Over capacity</span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      COMPLIANCE_BADGE_VARIANT[
                        salon.complianceLevel as keyof typeof COMPLIANCE_BADGE_VARIANT
                      ]
                    }
                  >
                    {salon.complianceScore}
                  </Badge>
                  {salon.complianceIssues.length > 0 && (
                    <p
                      className="text-xs text-muted-foreground"
                      title={salon.complianceIssues.join(', ')}
                    >
                      {salon.complianceIssues.slice(0, 2).join(', ')}
                      {salon.complianceIssues.length > 2 && '…'}
                    </p>
                  )}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      LICENSE_BADGE_VARIANT[
                        salon.licenseStatus as keyof typeof LICENSE_BADGE_VARIANT
                      ]
                    }
                  >
                    {salon.licenseStatus}
                  </Badge>
                  {salon.licenseDaysRemaining !== null && (
                    <p className="text-xs text-muted-foreground">
                      {salon.licenseDaysRemaining >= 0
                        ? `${salon.licenseDaysRemaining} days`
                        : `${Math.abs(salon.licenseDaysRemaining)} days overdue`}
                    </p>
                  )}
                </TableCell>

                <TableCell>
                  <span className="text-sm font-semibold">{salon.healthScore}%</span>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {salon.created_at ? format(new Date(salon.created_at), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {salons.map((salon) => (
          <div key={salon.id} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{salon.name}</p>
                {salon.chain_name && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground" title={salon.chain_name}>
                    <Building2 className="h-3 w-3" />
                    {salon.chain_name}
                  </p>
                )}
              </div>
              <Badge
                variant={
                  COMPLIANCE_BADGE_VARIANT[
                    salon.complianceLevel as keyof typeof COMPLIANCE_BADGE_VARIANT
                  ]
                }
              >
                {salon.complianceScore}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium block">Type</span>
                <span className="capitalize text-muted-foreground">{salon.business_type || 'salon'}</span>
              </div>
              <div>
              <span className="font-medium block">Rating</span>
              <span className="text-muted-foreground">
                {salon.rating_average ? salon.rating_average.toFixed(1) : 'N/A'}
                {salon.rating_count ? ` (${salon.rating_count})` : ''}
              </span>
            </div>
            <div>
              <span className="font-medium block">Revenue</span>
              <span className="text-muted-foreground">
                {salon.total_revenue ? `$${Number(salon.total_revenue).toLocaleString()}` : '$0'}
              </span>
            </div>
            <div>
              <span className="font-medium block">Staff</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                {salon.employee_count || 0}
              </span>
              {salon.staffCapacityRatio > 1 && (
                <span className="text-xs text-destructive">Over capacity</span>
              )}
            </div>
            <div>
              <span className="font-medium block">License</span>
              <Badge
                variant={
                  LICENSE_BADGE_VARIANT[
                    salon.licenseStatus as keyof typeof LICENSE_BADGE_VARIANT
                  ]
                }
              >
                {salon.licenseStatus}
              </Badge>
              {salon.licenseDaysRemaining !== null && (
                <span className="block text-xs text-muted-foreground">
                  {salon.licenseDaysRemaining >= 0
                    ? `${salon.licenseDaysRemaining} days`
                    : `${Math.abs(salon.licenseDaysRemaining)} days overdue`}
                </span>
              )}
            </div>
            <div>
              <span className="font-medium block">Created</span>
              <span className="text-muted-foreground">
                {salon.created_at ? format(new Date(salon.created_at), 'MMM dd, yyyy') : 'N/A'}
              </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
