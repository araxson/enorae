'use client'

import { useState } from 'react'
import { MoreVertical, Power } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/lib/hooks/use-toast'
import { toggleServiceAvailability, updateServiceProficiency } from '@/features/staff/services/api/mutations'
import { ServiceDetails } from './service-details'

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
  is_available?: boolean | null
}

type ServiceCardProps = {
  service: StaffService
}

function getProficiencyColor(level?: string | null) {
  switch (level) {
    case 'expert':
      return 'default'
    case 'intermediate':
      return 'secondary'
    case 'beginner':
      return 'outline'
    default:
      return 'outline'
  }
}

const formatLabel = (value?: string | null) =>
  (value ?? '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

export function ServiceCard({ service }: ServiceCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleToggleAvailability = async () => {
    setIsUpdating(true)
    try {
      await toggleServiceAvailability(service.id, !(service.is_available ?? true))
      toast({
        title: 'Service updated',
        description: `Service ${service.is_available ? 'disabled' : 'enabled'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update service',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateProficiency = async (level: 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
    setIsUpdating(true)
    try {
      await updateServiceProficiency(service.id, level)
      toast({
        title: 'Proficiency updated',
        description: `Service proficiency set to ${level}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update proficiency',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className={service.is_available === false ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{service.service_name}</CardTitle>
            {service.category_name ? (
              <CardDescription>{service.category_name}</CardDescription>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {service.is_available === false ? (
              <Badge variant="outline">Unavailable</Badge>
            ) : null}
            {service.proficiency_level ? (
              <Badge variant={getProficiencyColor(service.proficiency_level)}>
                {formatLabel(service.proficiency_level)}
              </Badge>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isUpdating} aria-label="Service actions menu">
                  <MoreVertical className="size-4" />
                  <span className="sr-only">Service actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Service actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToggleAvailability}>
                  <Power className="mr-2 size-4" />
                  {service.is_available === false ? 'Enable' : 'Disable'} service
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Update proficiency</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('beginner')}>
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('intermediate')}>
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('advanced')}>
                  Advanced
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateProficiency('expert')}>
                  Expert
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ServiceDetails
          effectiveDuration={service.effective_duration}
          effectivePrice={service.effective_price}
          performedCount={service.performed_count}
          ratingAverage={service.rating_average}
          ratingCount={service.rating_count}
        />
      </CardContent>
    </Card>
  )
}
