'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Star, MapPin } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type LocationMetric = {
  salonId: string
  salonName: string
  appointmentCount: number
  revenue: number
  rating: number
  reviewCount: number
  servicesCount: number
  staffCount: number
}

type Salon = Pick<Database['public']['Views']['salons_view']['Row'], 'id' | 'name' | 'city'>

type ChainLocationsListProps = {
  locations: LocationMetric[]
  salons: Salon[]
}

export function ChainLocationsList({ locations, salons }: ChainLocationsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Appointments</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Rating</TableHead>
          <TableHead className="text-right">Services</TableHead>
          <TableHead className="text-right">Staff</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No locations found in this chain
            </TableCell>
          </TableRow>
        ) : (
          locations.map((location) => {
            const salon = salons.find((s) => s.id === location.salonId)
            return (
              <TableRow key={location.salonId}>
                <TableCell>
                  <div>
                    <div className="font-medium">{location.salonName}</div>
                    {salon?.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {salon.city}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{location.appointmentCount}</TableCell>
                <TableCell className="text-right">${location.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-3 w-3 text-primary" fill="currentColor" />
                    <span>{location.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({location.reviewCount})</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{location.servicesCount}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{location.staffCount}</Badge>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
