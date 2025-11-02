'use client'

import { Edit, Trash2 } from 'lucide-react'

import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'

import type { AppointmentServiceDetails } from '@/features/business/appointments/api/queries'

interface ServicesTableProps {
  services: AppointmentServiceDetails[]
  onEdit: (service: AppointmentServiceDetails) => void
  onDelete: (service: AppointmentServiceDetails) => void
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  const formatTime = (time: string | null) => {
    if (!time) return '-'
    return new Date(time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'confirmed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Table>
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
          <TableRow key={service['id']}>
            <TableCell>
              <div>
                <p className="font-medium">Service ID: {service['service_id']}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm">{service['staff_id'] || 'Unassigned'}</p>
              </div>
            </TableCell>
            <TableCell>
              {formatTime(service['start_time'])} - {formatTime(service['end_time'])}
            </TableCell>
            <TableCell className="text-right">
              {service['duration_minutes'] ? `${service['duration_minutes']} min` : '-'}
            </TableCell>
            <TableCell className="text-right">
              -
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(service['status'])}>
                {service['status'] || 'pending'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <ButtonGroup aria-label="Service row actions">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(service)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(service)}
                  disabled={services.length <= 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
