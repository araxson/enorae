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

interface SalonsTableProps {
  salons: EnhancedSalon[]
}

const complianceVariant = {
  low: 'default',
  medium: 'secondary',
  high: 'destructive',
} as const

const licenseVariant = {
  valid: 'default',
  expiring: 'secondary',
  expired: 'destructive',
  unknown: 'outline',
} as const

export function SalonsTable({ salons }: SalonsTableProps) {
  if (salons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border py-12">
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No salons found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
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
                <Badge variant={complianceVariant[salon.complianceLevel]}>
                  {salon.complianceScore}
                </Badge>
                {salon.complianceIssues.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {salon.complianceIssues.slice(0, 2).join(', ')}
                    {salon.complianceIssues.length > 2 && '…'}
                  </p>
                )}
              </TableCell>

              <TableCell>
                <Badge variant={licenseVariant[salon.licenseStatus]}>
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
  )
}
