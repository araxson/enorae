'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2 } from 'lucide-react'
import type { AppointmentServiceDetails } from './types'
import { formatCurrency, formatTime, getStatusColor } from './utils'

interface ServicesTableProps {
  services: AppointmentServiceDetails[]
  onEdit: (service: AppointmentServiceDetails) => void
  onDelete: (service: AppointmentServiceDetails) => void
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  const handleEdit = useCallback((service: AppointmentServiceDetails) => {
    return () => {
      onEdit(service)
    }
  }, [onEdit])

  const handleDelete = useCallback((service: AppointmentServiceDetails) => {
    return () => {
      onDelete(service)
    }
  }, [onDelete])
  return (
    <Table>
      <TableCaption className="sr-only">Services booked for this appointment with assigned staff and pricing</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Duration</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell>
              <div>
                <p className="text-base font-medium">{service.service_name}</p>
                {service.category_name && (
                  <p className="text-xs text-muted-foreground">{service.category_name}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm">{service.staff_name || 'Unassigned'}</p>
                {service.staff_title && (
                  <p className="text-xs text-muted-foreground">{service.staff_title}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              {formatTime(service.start_time)} - {formatTime(service.end_time)}
            </TableCell>
            <TableCell className="text-right">
              {service.duration_minutes ? `${service.duration_minutes} min` : '-'}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(Number(service.current_price))}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(service.status)}>
                {service.status || 'pending'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleEdit(service)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete(service)}
                  disabled={services.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
