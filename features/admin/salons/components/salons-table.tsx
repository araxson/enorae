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
import { Building2, MapPin, Users } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type AdminSalon = Database['public']['Views']['admin_salons_overview']['Row']

type SalonsTableProps = {
  salons: AdminSalon[]
}

export function SalonsTable({ salons }: SalonsTableProps) {
  if (salons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No salons found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Salon</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Locations</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salons.map((salon) => (
            <TableRow key={salon.id} className="cursor-pointer hover:bg-accent/50">
              <TableCell>
                <div>
                  <p className="font-medium">{salon.name}</p>
                  {salon.business_name && salon.business_name !== salon.name && (
                    <p className="text-xs text-muted-foreground">{salon.business_name}</p>
                  )}
                  {salon.slug && (
                    <p className="text-xs text-muted-foreground">/{salon.slug}</p>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <span className="text-sm capitalize">{salon.business_type || 'salon'}</span>
              </TableCell>

              <TableCell>
                <Badge variant={salon.subscription_tier === 'premium' ? 'default' : 'outline'}>
                  {salon.subscription_tier || 'free'}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {/* TODO: Add location_count to admin_salons_overview view */}
                  <span className="text-sm">-</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{salon.employee_count || 0}</span>
                </div>
              </TableCell>

              <TableCell>
                {salon.is_accepting_bookings ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </TableCell>

              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {salon.created_at
                    ? format(new Date(salon.created_at), 'MMM dd, yyyy')
                    : 'N/A'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
